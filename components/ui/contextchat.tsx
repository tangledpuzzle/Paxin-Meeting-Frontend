import React, { useState, useRef, useEffect } from 'react';

const ContextMenu = () => {
    const [visible, setVisible] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', handleClick);
        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', handleClick);
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        
        setVisible(true);
        
        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = rootRef.current?.offsetWidth || 0;
        const rootH = rootRef.current?.offsetHeight || 0;
        
        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;
        
        if (rootRef.current) {
            if (right) {
                rootRef.current.style.left = `${clickX + 5}px`;
            }
            
            if (left) {
                rootRef.current.style.left = `${clickX - rootW - 5}px`;
            }
            
            if (top) {
                rootRef.current.style.top = `${clickY + 5}px`;
            }
            
            if (bottom) {
                rootRef.current.style.top = `${clickY - rootH - 5}px`;
            }
        }
    };

    const handleClick = (event: MouseEvent) => {
        const wasOutside = rootRef.current && !rootRef.current.contains(event.target as Node);
        
        if (wasOutside && visible) setVisible(false);
    };
    

    const handleScroll = () => {
        if (visible) setVisible(false);
    };
    
    return visible && (
        <div ref={rootRef} className="contextMenu">
            <div className="contextMenu--option">Share this</div>
            <div className="contextMenu--option">New window</div>
            <div className="contextMenu--option">Visit official site</div>
            <div className="contextMenu--option contextMenu--option__disabled">View full version</div>
            <div className="contextMenu--option">Settings</div>
            <div className="contextMenu--separator" />
            <div className="contextMenu--option">About this app</div>
        </div>
    );
};

export default ContextMenu;
