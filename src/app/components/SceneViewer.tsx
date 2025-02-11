import { useEffect, useRef, useState } from 'react';
import {
  createAPI,
  type SceneData,
  type SceneLoadFail,
} from '@novorender/data-js-api';
import { getDeviceProfile, View, type FlightController } from '@novorender/api';
import CameraControls from './CameraControls';
import SearchForm from './SearchForm';
import { CameraTransform } from '@/app/types';

export default function SceneViewer() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [canvasView, setCanvasView] = useState<View | null>(null);
  const [cameraControl, setCameraControl] = useState<FlightController | null>(
    null
  );
  const [viewSceneData, setViewSceneData] = useState<
    SceneData | SceneLoadFail
  >();
  const [cameraPositions, setCameraPositions] = useState<{
    [key: number]: CameraTransform | null;
  }>({
    1: null, // Camera 1
    2: null, // Camera 2
    3: null, // Camera 3
  });

  useEffect(() => {
    main(canvas.current);
  }, []);

  async function getView(canvas: HTMLCanvasElement | null) {
    if (!canvasView) {
      const gpuTier = 2;
      const deviceProfile = getDeviceProfile(gpuTier);
      const baseUrl = new URL('/novorender/api/', location.origin);
      const imports = await View.downloadImports({ baseUrl });

      const view = new View(
        canvas as HTMLCanvasElement,
        deviceProfile,
        imports
      );
      return view;
    }
    return canvasView;
  }

  const handleCameraChange = (buttonId: number) => {
    const cameraState = cameraPositions[buttonId];
    if (cameraState && canvasView) {
      canvasView.activeController.moveTo(
        cameraState.position,
        1000,
        cameraState.rotation
      );
    }
  };

  async function main(canvas: HTMLCanvasElement | null) {
    const view = await getView(canvas);
    view?.modifyRenderState({ grid: { enabled: true } });
    setCanvasView(view);

    const cameraController = await view.switchCameraController('flight');
    setCameraControl(cameraController);

    const dataApi = createAPI({
      serviceUrl: 'https://data.novorender.com/api',
    });

    const sceneData = await dataApi.loadScene(
      '95a89d20dd084d9486e383e131242c4c'
    );
    setViewSceneData(sceneData);

    const { url: _url } = sceneData as SceneData;
    const url = new URL(_url);
    const parentSceneId = url.pathname.replaceAll('/', '');
    url.pathname = '';
    const config = await view.loadScene(url, parentSceneId, 'index.json');
    const { center, radius } = config.boundingSphere;
    view.activeController.autoFit(center, radius);
    await view.run();
    view.dispose();
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <SearchForm
        canvasView={canvasView}
        viewSceneData={viewSceneData}
      />
      <CameraControls
        cameraPositions={cameraPositions}
        setCameraPositions={setCameraPositions}
        cameraControl={cameraControl}
        handleCameraChange={handleCameraChange}
      />
      <canvas
        ref={canvas}
        style={{ width: '100%', height: '100%', background: 'grey' }}
      ></canvas>
    </div>
  );
}
