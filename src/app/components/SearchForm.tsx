import React, { useState } from 'react';
import {
  type RenderStateHighlightGroups,
  createNeutralHighlight,
} from '@novorender/api';
import { SearchFormProps } from '@/app/types';

const SearchForm = ({ canvasView, viewSceneData }: SearchFormProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (viewSceneData && 'db' in viewSceneData) {
      try {
        const { db } = viewSceneData;
        if (db) {
          const controller = new AbortController();
          const signal = controller.signal;

          const result: number[] = [];

          const iterator = db.search({ searchPattern: inputValue }, signal);
          for await (const object of iterator) {
            result.push(object.id);
          }

          if (!result.length) {
            const iterator = db.search({ parentPath: '' }, signal); // It loads the whole model
            for await (const object of iterator) {
              result.push(object.id);
            }
          }

          const renderStateHighlightGroups: RenderStateHighlightGroups = {
            defaultAction: 'hide',
            groups: [{ action: createNeutralHighlight(), objectIds: result }],
            defaultPointVisualization: undefined,
          };

          canvasView?.modifyRenderState({
            highlights: renderStateHighlightGroups,
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder='Enter text here to search...'
        style={{
          padding: '5px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <button
        type='submit'
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
          border: 'none',
          background: '#007bff',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default SearchForm;
