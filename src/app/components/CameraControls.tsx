import React from 'react';
import { CameraControlsProps } from '@/app/types'

const CameraControls = ({
  cameraPositions,
  setCameraPositions,
  cameraControl,
  handleCameraChange,
}: CameraControlsProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonId = Number(event.currentTarget.dataset.buttonId);
    if (event.shiftKey && event.button === 0) {
      if (cameraControl) {
        setCameraPositions((prev) => ({
          ...prev,
          [buttonId]: {
            position: cameraControl.position,
            rotation: cameraControl.rotation,
          },
        }));
      }
    } else {
      handleCameraChange(buttonId);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}
    >
      {Object.keys(cameraPositions).map((id) => (
        <button
          key={id}
          data-button-id={id}
          onClick={handleClick}
          style={{ marginRight: '10px' }}
        >
          Camera {id}
        </button>
      ))}
    </div>
  );
};

export default CameraControls;
