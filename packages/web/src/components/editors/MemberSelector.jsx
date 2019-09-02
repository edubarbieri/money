import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import 'sass/memberSelect';
import '../../styles/sass/buttons';
import config from 'app/config';

const MemberSelector = ({ member: selectedMember, setMember: setSelectedMember }) => {
    const membersList = useSelector(state => state.wallet.members);
    const [show, setShow] = useState(false);

    const renderMember = (member) => {
        return (
            <div className={(membersList.length === 1) ? 'member-select active hide-remove' : 'member-select active'}>
                <img className="img-circle avatar pointer"  alt="" src={member.avatar || config.defaultAvatar} onClick={()=>{setSelectedMember({});setShow(true)}} />
                <p className="pointer" onClick={()=>{setSelectedMember({});setShow(true)}}>{member.name}</p>
                <i className="far fa-trash-alt" onClick={()=>setSelectedMember({})} />
            </div>
        )
    }

    const selectMemmber = (member) => {
        setSelectedMember(member)
        setShow(false);
    }

    const renderMemberItem = () => {
        if(!membersList){
            return;
        }
        return membersList.map((member, idx) => (
            <li className="member-item" key={idx} onClick={() => selectMemmber(member)}>
                <img className="img-circle avatar"  alt="" src={member.avatar || config.defaultAvatar} />
                <p>{member.name}</p>
            </li>
        ))
    }

    const renderSelection = () => {
        return (
            <div className="member-select">
                <label className={(show) ? 'hidden' : ''} onClick={() => setShow(!show)} >Selecione um membro</label>
                <ul className={(show) ? '' : 'hidden'}>
                    {renderMemberItem()}
                </ul>
            </div>
        )
    }

    const render = () => {
        let member = selectedMember;
        if(membersList && membersList.length === 1){
            member = membersList[0];
        }
        if(member && member.id){
            return renderMember(member);
        }
        return renderSelection();
    }

    return (
        <div>
            {render()}
        </div>
    );
}

export default MemberSelector;