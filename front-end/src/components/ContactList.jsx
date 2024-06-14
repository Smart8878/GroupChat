import React, { useState } from 'react';
import { createGroupFields } from '../utils/constants';
import { AppButton } from './button/AppButton';
import { AppForm } from './form/AppForm';
import { AppModal } from "./modal/Modal"

const ContactList = ({ contacts, onSelectContact, handleCreateGroup,
  handleAddMember, groupName, setGroupName,
  isOpenCreateGroup, setIsOpenCreateGroup }) => {
  const onInputChange = (e) => {
    setGroupName(e.target.value)
  }
  return (
    <div className="contact-list">
      <div className='creategroup'>
        <AppModal handleClose={() => { setIsOpenCreateGroup(!isOpenCreateGroup) }} isOpen={isOpenCreateGroup} title={"Create Group"}>

          <div className="user_dashboard-container-edit_profile">
            <AppForm
              formValues={{ groupname: groupName }}
              encType="multipart/form-data"
              onInputChange={onInputChange}
              inputFields={createGroupFields}
            />
            <AppButton
              className="user_dashboard-container-edit_profile-button"
              onClick={() => handleCreateGroup(groupName)}
            >
              Create Group
            </AppButton>
          </div>
        </AppModal>

        <button onClick={() => setIsOpenCreateGroup(true)} className="createbtn">+ Create</button>
      </div>
<div className='groups'>

<div className="group-list">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className="contact"
            onClick={() => onSelectContact(contact)}
          >
            {contact.name}
          </div>
        ))}
      </div>
</div>

    </div>
  );
};

export default ContactList;
