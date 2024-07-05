import React, { useEffect } from 'react';
import LazyBodyPix from '@/lib/LazyBodyPix';

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
  const { pipeline, canvasRef, setBodyPix } = useRenderingPipeline(
    sourcePlayback,
    backgroundConfig,
    segmentationConfig,
    null,
    tflite
  );

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
      <LazyBodyPix>
        {(bodyPix) => {
          if (bodyPix) {
            setBodyPix(bodyPix);
          }

          return (
            <canvas
              key={segmentationConfig.pipeline}
              ref={canvasRef}
              className='render my-5 w-full'
              width={sourcePlayback.width}
              height={sourcePlayback.height}
              id={id}
            />
          );
        }}
      </LazyBodyPix>
    </div>
  );
};

export default OutputViewer;
