import React, { ReactNode, useEffect, useState } from 'react';

type BodyPixModel = any; 

interface LazyBodyPixProps {
  children: (bodyPix: BodyPixModel) => ReactNode;
}

const LazyBodyPix: React.FC<LazyBodyPixProps> = ({ children }) => {
  const [bodyPixModel, setBodyPixModel] = useState<BodyPixModel>(null);

  useEffect(() => {
    const loadBodyPix = async () => {
      const bodyPix = await import('@tensorflow-models/body-pix');
      const loadedModel = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
      });
      setBodyPixModel(loadedModel);
    };

    loadBodyPix();
  }, []);

  return <>{children(bodyPixModel)}</>;
};

export default LazyBodyPix;
