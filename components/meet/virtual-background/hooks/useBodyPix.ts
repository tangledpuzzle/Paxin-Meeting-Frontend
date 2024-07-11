import { useEffect, useState } from 'react';
import * as tfBodyPix from '@tensorflow-models/body-pix';

let bodyPixStore: tfBodyPix.BodyPix | null = null;

function useBodyPix() {
  const [bodyPix, setBodyPix] = useState<tfBodyPix.BodyPix | null>(null);

  useEffect(() => {
    async function loadBodyPix() {
      console.log('Loading TensorFlow.js and BodyPix segmentation model');

      // Динамический импорт TensorFlow.js и BodyPix
      const [tf, tfBodyPix] = await Promise.all([
        import('@tensorflow/tfjs'),
        import('@tensorflow-models/body-pix')
      ]);

      await tf.ready();
      const loadedBodyPix = await tfBodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
      });

      bodyPixStore = loadedBodyPix;
      setBodyPix(loadedBodyPix);
      console.log('TensorFlow.js and BodyPix loaded');
    }

    let timeout: NodeJS.Timeout | undefined;

    if (!bodyPixStore) {
      timeout = setTimeout(() => {
        loadBodyPix();
      }, 500);
    } else {
      setBodyPix(bodyPixStore);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return bodyPix;
}

export default useBodyPix;
