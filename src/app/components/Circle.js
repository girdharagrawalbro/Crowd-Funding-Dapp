"use client";
import React from 'react';

export default function Circle() {
    return (
        <>
            {/* Large quarter circles */}
            <div className={`rightquarterCircle hidden sm:block`}></div>
            <div className={`leftquarterCircle hidden sm:block`}></div>
            
            {/* Small circles - position adjusted for mobile */}
            <div className={`leftsmallCircle1 hidden sm:block`}></div>
            <div className={`leftsmallCircle2 hidden sm:block`}></div>
            <div className={`rightsmallCircle1 hidden sm:block`}></div>
            <div className={`rightsmallCircle2 hidden sm:block`}></div>
            
            {/* Mobile-optimized circles (simpler decoration) */}
            <div className={`mobileCircle1 sm:hidden`}></div>
            <div className={`mobileCircle2 sm:hidden`}></div>
        </>
    );
}