import React from 'react';
import '../styles/Skeleton.css';

interface SkeletonProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius, className }) => {
    return (
        <div
            className={`skeleton-base ${className || ''}`}
            style={{
                width: width || '100%',
                height: height || '20px',
                borderRadius: borderRadius || '4px'
            }}
        />
    );
};

export default Skeleton;
