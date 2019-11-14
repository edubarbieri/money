import React from 'react';
import { bundle } from 'i18n/bundle';

const SiteInfo = () => {
    return (
        <div className="site-info">
            {bundle('site.info.message')}<br/>
            <strong>
                <a rel="noopener noreferrer" target="_blank" href="https://github.com/edubarbieri">Eduardo Barbieri</a>
            </strong>
            &nbsp;{bundle('and')}&nbsp;
            <strong>
                <a rel="noopener noreferrer" target="_blank" href="https://twitter.com/mdsbarbieri">Matheus Barbieri</a>
            </strong>
        </div>
    );
}

export default SiteInfo;
