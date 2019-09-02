import React from 'react';
import Profile from './Profile'
import WalletSelector from './WalletSelector';
import Notifications from './Notifications';
import 'sass/sidebar'

const Header = () => {
  return ( 
      <>
        <div className="col-sm-6 col-xs-7">
          <WalletSelector />
        </div>
        <div className="col-sm-6 col-xs-5">
            <Profile />
            <Notifications />
        </div>
      </>
  );
}

export default Header;