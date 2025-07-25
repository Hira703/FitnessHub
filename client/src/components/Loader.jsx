import React from 'react';
import { ImSpinner, ImSpinner2 } from 'react-icons/im';

const Loader = () => {
    return (
        <div className="flex justify-center items-center py-24">
        <ImSpinner2 className="animate-spin text-5xl text-[#1D4ED8]" />
      </div>
    );
};

export default Loader;