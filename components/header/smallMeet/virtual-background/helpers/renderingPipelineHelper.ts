import { PostProcessingConfig } from './postProcessingHelper';
import { BodyPix } from '@tensorflow-models/body-pix';

export type RenderingPipeline = {
  render(): Promise<void>;
  updatePostProcessingConfig(
    newPostProcessingConfig: PostProcessingConfig
  ): void;
  setBodyPixModel(bodyPix: BodyPix): void;
  cleanUp(): void;
};
