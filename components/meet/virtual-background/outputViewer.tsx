import React, { useEffect } from 'react';
import useBodyPix from '@/components/header/smallMeet/virtual-background/hooks/useBodyPix';

import { BackgroundConfig } from './helpers/backgroundHelper';
import { PostProcessingConfig } from './helpers/postProcessingHelper';
import { SegmentationConfig } from './helpers/segmentationHelper';
import { SourcePlayback } from './helpers/sourceHelper';
import useRenderingPipeline from './hooks/useRenderingPipeline';

type OutputViewerProps = {
  sourcePlayback: SourcePlayback;
  backgroundConfig: BackgroundConfig;
  segmentationConfig: SegmentationConfig;
  postProcessingConfig: PostProcessingConfig;
  tflite: any;
  id: string;
  onCanvasRef?: (canvasRef: React.MutableRefObject<HTMLCanvasElement>) => void;
};

const OutputViewer = ({
  sourcePlayback,
  backgroundConfig,
  segmentationConfig,
  postProcessingConfig,
  tflite,
  id,
  onCanvasRef,
}: OutputViewerProps) => {
  const bodyPix = useBodyPix();
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
    // eslint-disable-next-line
  }, [canvasRef]);

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
