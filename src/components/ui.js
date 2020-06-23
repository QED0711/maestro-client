import React from 'react';


// ==================================== GRID ====================================
export const Grid = ({ children, cols, spacing, className, style }) => {
    style = style || {}
    spacing = spacing || "1fr"
    
    className = className ? "div-grid " + className : "div-grid" 
    className = `grid ${className}`
    
    return <div className={className} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${spacing})`, ...style }}>{children}</div>
} 



// ==================================== TAB BUTTON ====================================

export const TabButton = ({children, handleClick, disabled, selected}) => {
    
    return (
        <button className={`tab-button tab-button-selected-${!!selected}`} onClick={handleClick} disabled={!!disabled}>
            {children}
        </button>
    )
}

// ==================================== SECTION ====================================

export const Section = ({children, id, className, style}) => {
    
    id = id || "";
    className = className ? "section-panel " + className : "section-panel"
    style = style || {}

    return (
        <section id={id} className={className} style={{...style}}>
            {children}
        </section>
    )

}