import React, { useEffect, useMemo, useState } from 'react';

import { RootState } from '@/store';
import { useAppSelector } from '@/store/hook';
import { TextWithInfo } from '@/store/slices/interfaces/speechServices';

interface FinalTexts {
  first?: TextWithInfo;
  second?: TextWithInfo;
}

const speechServicesSelector = (state: RootState) => state.speechServices;

const SubtitleArea = () => {
  const speechServices = useAppSelector(speechServicesSelector);

  const [finalTexts, setFinalTexts] = useState<FinalTexts>({
    first: undefined,
    second: undefined,
  });
  const [subtitleText, setSubtitleText] = useState<string | undefined>(
    undefined
  );

  useMemo(() => {
    if (speechServices.finalText) {
      setFinalTexts((prevState) => ({
        ...prevState,
        first: prevState.first,
        second: speechServices.finalText,
      }));
    }
  }, [speechServices.finalText]);

  useEffect(() => {
    if (!finalTexts.first && !finalTexts.second) {
      return;
    }
    let lastLineFrom = '';

    let text: string[] = [];
    if (
      finalTexts.first &&
      finalTexts.first?.from === finalTexts.second?.from
    ) {
      // both are the same person
      const t = finalTexts.first.text + ' ' + finalTexts.second?.text;
      text.push(`${finalTexts.first.from}:`, t.slice(-50));
      lastLineFrom = finalTexts.first.from;
    } else {
      // they are both different person
      if (finalTexts.first) {
        text.push(
          `${finalTexts.first.from}:`,
          finalTexts.first.text.slice(-20)
        );
        if (finalTexts.second) {
          // if second data exist, then we'll require adding a new line
          text.push('\n');
        }
        lastLineFrom = finalTexts.first.from;
      }

      if (finalTexts.second) {
        text.push(
          `${finalTexts.second.from}:`,
          finalTexts.second.text.slice(-50)
        );
        lastLineFrom = finalTexts.second.from;
      }
    }

    if (speechServices.interimText) {
      if (speechServices.interimText.text.length > 100) {
        // if we have a lot of text then better to show only those
        text = [
          `${speechServices.interimText.from}:`,
          speechServices.interimText.text.slice(-200),
        ];
      } else {
        if (lastLineFrom === speechServices.interimText.from) {
          text.push(speechServices.interimText.text);
        } else {
          text.push(
            '\n',
            `${speechServices.interimText.from}:`,
            speechServices.interimText.text
          );
        }
      }
    }

    if (!text.length) {
      return;
    }

    setSubtitleText(text.join(' '));
    const clear = setTimeout(() => {
      setSubtitleText(undefined);
    }, 10000);

    return () => {
      if (clear) {
        clearTimeout(clear);
      }
    };
  }, [finalTexts, speechServices.interimText]);

  return (
    <>
      {speechServices.selectedSubtitleLang !== '' &&
      subtitleText !== undefined ? (
        <div
          className='sub-title pointer-events-none absolute bottom-4  left-1/2 flex w-11/12 -translate-x-1/2 items-center px-10'
          style={{ fontSize: speechServices.subtitleFontSize }}
        >
          <p className='m-auto inline-block whitespace-pre-wrap break-words bg-black px-2 py-1 text-center text-white'>
            {subtitleText}
          </p>
        </div>
      ) : null}
    </>
  );
};

export default SubtitleArea;
