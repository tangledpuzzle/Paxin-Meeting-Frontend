import React, { useEffect, useContext, useState } from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

function Arrow({
  children,
  disabled,
  onClick
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        right: "1%",
        opacity: disabled ? "0" : "1",
        userSelect: "none"
      }}
    >
      {children}
    </button>
  );
}

export function LeftArrow() {
  const {
    isFirstItemVisible,
    scrollPrev,
    visibleElements,
    initComplete
  } = useContext(VisibilityContext);

  const [disabled, setDisabled] = useState(
    !initComplete || (initComplete && isFirstItemVisible)
  );

  useEffect(() => {
    setDisabled(!initComplete || (initComplete && isFirstItemVisible));
  }, [initComplete, isFirstItemVisible]);

  return (
    <Arrow disabled={disabled} onClick={() => scrollPrev()}>
      <Button>
        <ArrowLeftIcon className="size-4" />
      </Button>
    </Arrow>
  );
}

export function RightArrow() {
    const { isLastItemVisible, scrollNext, visibleElements } = useContext(
      VisibilityContext
    );
  
    const [disabled, setDisabled] = useState(true);
  
    useEffect(() => {
      setDisabled(!visibleElements.length || isLastItemVisible);
    }, [isLastItemVisible, visibleElements]);
  
    return (
      <Arrow disabled={disabled} onClick={() => scrollNext()}>
        <Button>
          <ArrowRightIcon className="size-4" />
        </Button>
      </Arrow>
    );
  }