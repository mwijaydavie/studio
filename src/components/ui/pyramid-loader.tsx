"use client";

import React from 'react';

/**
 * High-fidelity Pyramid Loader
 * Synthesizes a 3D spinning pyramid using standard CSS hardware acceleration.
 */
export function PyramidLoader() {
  return (
    <div className="pyramid-loader scale-75 md:scale-100">
      <div className="pyramid-wrapper">
        <span className="side side1" />
        <span className="side side2" />
        <span className="side side3" />
        <span className="side side4" />
        <span className="pyramid-shadow" />
      </div>  
    </div>
  );
}