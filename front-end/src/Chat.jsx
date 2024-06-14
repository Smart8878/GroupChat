import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
// import { Manager } from "socket.io-client";
import { createGroup, getGroups, addMember } from './services/api';

const socket = io("http://localhost:8081");

// or, more explicit version
// const manager = new Manager("http://localhost:8081");
// const socket = manager.socket("/");

function Chat() {
    const [groups, setGroups] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [groupName, setGroupName] = useState('');
    const [memberName, setMemberName] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            const groups = await getGroups();
            setGroups(groups);
        };
        fetchGroups();
    }, []);

    useEffect(() => {
        socket.emit('joinGroup', currentGroup);
    }, [currentGroup]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('messageLiked', (updatedMessage) => {
            setMessages((prevMessages) =>
                prevMessages.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
            );
        });

        return () => {
            socket.off('message');
            socket.off('messageLiked');
        };
    }, []);

    const handleSendMessage = () => {
        socket.emit('sendMessage', { content: newMessage, group: currentGroup });
        setNewMessage('');
    };

    const handleLikeMessage = (messageId) => {
        socket.emit('likeMessage', messageId);
    };

    const handleCreateGroup = async () => {
        if (groupName.trim() === '') return;

        const newGroup = await createGroup(groupName);
        setGroups([...groups, newGroup]);
        setGroupName('');
    };

    const handleAddMember = async (groupId) => {
        if (memberName.trim() === '') return;

        const updatedGroup = await addMember(groupId, { name: memberName });
        const updatedGroups = groups.map((group) =>
            group._id === updatedGroup._id ? updatedGroup : group
        );
        setGroups(updatedGroups);
        setMemberName('');
    };

    return (
        <div>
            <h1>Group Chat</h1>
            <div>
                <h2>Groups</h2>
                <div>
                    <h2>Create Group</h2>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                    />
                    <button onClick={handleCreateGroup}>Create Group</button>
                </div>
                <div>
                    <h2>Groups</h2>
                    <ul>
                        {groups.map((group) => (
                            <li key={group._id}>
                                {group.name}
                                <input type="text" placeholder='add user name' value={memberName} onChange={(e)=>setMemberName(e.target.value)} />
                                <button onClick={() => handleAddMember(group._id)}>Add Member</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <ul>
                    {groups.map((group) => (<>
                        <li key={group._id} onClick={() => setCurrentGroup(group._id)}>
                            {group.name}
                        </li>
                        {group.members.map(item=>{
                            return(<div>{item.name}</div>)
                        })}
                    </>
                       
                    ))}
                </ul>
            </div>
            <div>
                <h2>Messages</h2>
                <ul>
                    {messages.map((message) => (
                        <li key={message._id}>
                            {message.content}
                            <button onClick={() => handleLikeMessage(message._id)}>Like ({message.likes})</button>
                        </li>
                    ))}
                </ul>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
               {currentGroup} <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Chat;
