// File: src/components/ProvinceModal.jsx
import React from 'react';
import provinceData from '../data/provincesDetails.json';

const ProvinceModal = ({ provinceName, onClose }) => {
    const province = provinceData.provinces.find(p => p.name === provinceName);

    if (!province) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <aside className="left-menu">
                    <ul>
                        {Object.keys(province.categories).map(category => (
                            <li key={category}>{category}</li>
                        ))}
                    </ul>
                </aside>
                <div className="modal-details">
                    <h2>{province.name}</h2>
                    <div className="category-details">
                        {Object.entries(province.categories).map(([category, content]) => (
                            <div key={category}>
                                <h3>{category}</h3>
                                <p>{content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProvinceModal;