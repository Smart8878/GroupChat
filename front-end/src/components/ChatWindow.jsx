import { positions } from '@mui/system';
import React from 'react';
import { useSelector } from 'react-redux';

const ChatWindow = ({ messages, currentContact, setIsOpenAddMember }) => {
  const { user, error } = useSelector((state) => state?.user);

  return (<>
    <div className='chatHeader'>
      <div className='title'>{currentContact?.name}</div>
      <button className='createbtn' style={{ position: 'unset', margin: 0 }} onClick={() => setIsOpenAddMember(true)}>+ Add Member</button>
    </div>
    <div className="chat-window">
      {messages.map((message, index) => (

        <div>
          <div key={index} className={`message ${user?._id == message?.user?._id ? 'outgoing' : 'incoming'}`}>
            <div className='name'>{message?.user?.name}</div>
            <div className="message-content">{message.content}</div>
          </div>
        </div>
      ))}
    </div>
  </>
  );
};

export default ChatWindow;
