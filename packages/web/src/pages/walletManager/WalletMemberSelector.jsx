import React, { useState } from 'react';
import bundle, { bundleFormat } from 'i18n/bundle';
import { useDispatch } from 'react-redux';
import ModalConfirmation from 'components/modal/ModalConfirmation';
import Modal from 'components/modal/Modal';
import LoaderFragment from 'components/loader/LoaderFragment';
import { validateEmail } from 'service/util';
import _ from 'lodash';
import 'sass/wallet';
import 'sass/labels';
import 'sass/views';
import 'sass/modals';
import { user, wallet as walletService } from 'mymoney-sdk';
import { SET_REFRESH } from 'store/globalActions';
import Error from 'components/message/Error';

const WalletMemberSelector = ({ wallet = {} }) => {
    const dispatch = useDispatch();
    const emptyRemoveConfirmation = { show: false, member: {}, message: '' };
    const [showModal, setShowModal] = useState({
        show: false,
        title: '',
        message: ''
    });
    const [removeConfirmation, setRemoveConfirmation] = useState(emptyRemoveConfirmation);
    const [showLoader, setShowLoader] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [errors, setErrors] = useState([]);

    const checkUseInWallet = (userId) => {
        return _.find(wallet.users, {id: userId});
    }


    const sendInvite = (event) => {
        event.preventDefault();
        if (!validateEmail(inviteEmail)) {
            return;
        }

        
        setShowLoader(true);
        user.findUser(inviteEmail).then(res => {
            if (res.status > 400) {
                setErrors(res.errors);
                return;
            }

            if(!res.id){
                setErrors([bundle('member.not.found')]);
                setShowLoader(false);
                return;
            }

            if(checkUseInWallet(res.id)){
                setErrors([bundle('member.already.wallet')]);
                setShowLoader(false);
                return;
            }

            walletService.addUser(wallet.id, res.id).then(result => {
                if (result.status > 400) {
                    setShowLoader(false);
                    setErrors(result.errors);
                    return;
                }
                setShowModal({
                    title: bundle('invite.confirmation.title'),
                    show: true,
                    message: bundleFormat('invite.confirmation.message', res.name, res.email)
                });
                setShowLoader(false);
                setInviteEmail('');
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
            setErrors(['generic.error']);
        })

    }

    const hideModal = () => {
        setShowModal({ ...showModal, show: false });
    }

    const showModalRemoveMember = (member) => {
        const modalConfirmationData = {
            onConfirm: removeMember,
            member: member,
            show: true,
            message: bundleFormat('remove.member.confirmation', member.name)
        }
        setRemoveConfirmation(modalConfirmationData);
    }

    const removeMember = (member) => {
        walletService.removeUser(wallet.id, member.id).then(res => {
            setRemoveConfirmation(emptyRemoveConfirmation);
            if (res.status > 400) {
                setErrors(res.errors);
                return;
            }
            dispatch({ type: SET_REFRESH, payload: {type: 'wallet', value: new Date().getTime()}});
        }).catch(err => {
            console.log(err);
            setErrors(['generic.error']);
        })
    }

    const getMemberStatus = (user) => {
        if(user.isOwner){
            return <p><span className="label label-default">{bundle('owner')}</span></p>;
        }

        if (!user.active) {
            return <p><span className="label label-primary">{bundle('pending')}</span></p>
        }
        return <p><span className="label label-success">{bundle('active')}</span></p>
    }

    const renderMember = () => {
        if (!wallet.users) {
            return;
        }
        return wallet.users.map((user, idx) => (
            <div key={idx} className="col-lg-4 col-sm-6">
                <div className="card">
                    <div className="card-header">
                        <div className="card-photo">
                            <img className="img-circle avatar" alt="" src={user.avatar} />
                        </div>
                        <div className="card-short-description">
                            <h6>
                                {user.name}
                            </h6>
                            {getMemberStatus(user)}
                        </div>
                        <i className={(user.isOwner) ? 'hidden' : 'card-remove far fa-trash-alt'}
                            onClick={() => showModalRemoveMember(user)}></i>
                    </div>
                </div>
            </div>
        ))
    }

    const closeModalAndRefresh = () => {
        dispatch({ type: SET_REFRESH, payload: {type: 'wallet', value: new Date().getTime()}});
        hideModal();
    }

    const checkShowModal = () => {
        return showModal.show &&
            <ModalConfirmation
                size="small"
                onClose={closeModalAndRefresh}
                onConfirm={closeModalAndRefresh}
                title={showModal.title}
                message={showModal.message} />
    }

    const checkRemoveConfirmationModal = () => {
        return removeConfirmation.show &&
            <Modal
                size="small"
                onCancel={() => setRemoveConfirmation(emptyRemoveConfirmation)}
                onConfirm={() => removeMember(removeConfirmation.member)}
                title={bundle('remove.member.title')}
                text={removeConfirmation.message} />

    }

    const checkShowLoader = () => {
        return showLoader && <LoaderFragment />
    }

    return (
        <div className="panel-body members-selector">
            {checkShowModal()}
            {checkShowLoader()}
            {checkRemoveConfirmationModal()}
            <form onSubmit={sendInvite}>
                <div className="form-group">
                    <div className="control-title" >{bundle('menber.invite')}</div>
                    <Error errors={errors} setErrors={setErrors}/>
                    <div className="input-group">
                        <span className="input-group-addon" onClick={sendInvite}>
                            <i className="far fa-paper-plane" />
                        </span>
                        <input
                            type="email"
                            id="walletInptMemberSelector"
                            className="form-control"
                            value={inviteEmail}
                            onChange={event => setInviteEmail(event.target.value)} />
                    </div>
                    <p className="text-muted wallet-invite-message">{bundle('menber.invite.detailed')}</p>
                </div>
            </form>
            <div className="cards-container box-view grid-view">
                {renderMember()}
            </div>
        </div>
    );
}

export default WalletMemberSelector;