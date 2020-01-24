import React from 'react';

const Spinner = () => {
    return (
        <div className="preloader-wrapper active">
            <div className="spinner-layer spinner-teal-only">
                <div className="circle-clipper left">
                    <div className="circle"></div>
                </div>
                <div className="gap-patch">
                    <div className="circle"></div>
                </div>
                <div className="circle-clipper right">
                    <div className="circle"></div>
                </div>
            </div>
        </div>
    );
};

export default Spinner;
