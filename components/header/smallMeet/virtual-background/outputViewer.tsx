import React, { useEffect } from 'react';
import { BodyPix } from '@tensorflow-models/body-pix';

import { BackgroundConfig } from './helpers/backgroundHelper';
import { PostProcessingConfig } from './helpers/postProcessingHelper';
import { SegmentationConfig } from './helpers/segmentationHelper';
import { SourcePlayback } from './helpers/sourceHelper';
import useRenderingPipeline from './hooks/useRenderingPipeline';
import { TFLite } from './hooks/useTFLite';

type OutputViewerProps = {
  sourcePlayback: SourcePlayback;
  backgroundConfig: BackgroundConfig;
  segmentationConfig: SegmentationConfig;
  postProcessingConfig: PostProcessingConfig;
  bodyPix: BodyPix;
  tflite: TFLite;
  id: string;
  onCanvasRef?: (canvasRef: React.MutableRefObject<HTMLCanvasElement>) => void;
};

const OutputViewer = ({
  sourcePlayback,
  backgroundConfig,
  segmentationConfig,
  postProcessingConfig,
  bodyPix,
  tflite,
  id,
  onCanvasRef,
}: OutputViewerProps) => {
  const { pipeline, canvasRef, setBodyPix } = useRenderingPipeline(
    sourcePlayback,
    backgroundConfig,
    segmentationConfig,
    bodyPix,
    tflite
  );

  useEffect(() => {
    if (bodyPix) {
      setBodyPix(bodyPix);
    }
  }, [bodyPix, setBodyPix]);

  useEffect(() => {
    if (pipeline) {
      pipeline.updatePostProcessingConfig(postProcessingConfig);
    }
  }, [pipeline, postProcessingConfig]);

  useEffect(() => {
    const sendCanvasRef = () => {
      if (onCanvasRef && canvasRef) {
        onCanvasRef(canvasRef);
      }
    };

    const timeout = setTimeout(() => {
      sendCanvasRef();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [canvasRef, onCanvasRef]);

  return (
    <div className='root preview-camera-webcam'>
      {bodyPix ? (
        <canvas
          key={segmentationConfig.pipeline}
          ref={canvasRef}
          className='render my-5 w-full'
          width={sourcePlayback.width}
          height={sourcePlayback.height}
          id={id}
        />
      ) : (
        <p>Loading BodyPix model...</p>
      )}
    </div>
  );
};

export default OutputViewer;
