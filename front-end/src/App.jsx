import { useEffect, useState } from "react";
import io from 'socket.io-client';
import { AllRoutes } from "./AllRoutes";
import Chat from "./Chat";
import ChatWindow from "./components/ChatWindow";
import ContactList from "./components/ContactList";
import MessageInput from "./components/MessageInput";
import { createGroup, getGroups, addMember } from './services/api';
import './App.css'; // Create a corresponding CSS file for styling
import { useSelector } from "react-redux";
import { AppModal } from "./components";
import MultipleSelectChip from "./components/MultiSelect";

const socket = io('http://localhost:8081');

function App() {
  const [connected, setConnected] = useState(false);
  const [contacts, setContacts] = useState([]); // Replace with actual contacts
  const [currentContact, setCurrentContact] = useState(contacts[0]);
  const [messages, setMessages] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isOpenCreateGroup, setIsOpenCreateGroup] = useState(false);
  const [isOpenAddMember, setIsOpenAddMember] = useState(false);


  const { user, error } = useSelector((state) => state?.user);
  useEffect(() => {
    const fetchGroups = async () => {
      const groups = await getGroups();
      console.log(groups)
      setContacts(groups);
    };
    fetchGroups();
  }, []);

  useEffect(() => {

    socket.on('connect', () => {
      console.log('Connected to the server');
      setConnected(true);
      socket.emit('joinGroup', currentContact?._id); // Join the initial group
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
      setConnected(false);
    });

    socket.on('message', (message) => {
      console.log('New message received:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on('messages', (messages) => {
      console.log('All New message received:', messages);
      setMessages((prevMessages) => [...messages]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, [currentContact]);

  const handleSendMessage = (message) => {
    socket.emit('sendMessage', { content: message, group: currentContact._id, user: user._id });
  };

  const handleLikeMessage = (messageId) => {
    socket.emit('likeMessage', messageId);
  };

  const handleCreateGroup = async (groupName) => {
    if (groupName.trim() === '') return;

    const newGroup = await createGroup(groupName);
    setContacts([...contacts, newGroup]);
    setGroupName('');
    setIsOpenCreateGroup(false)
  };

  const handleAddMember = async (groupId) => {
    console.log(groupId, "-=-=-=-=-")
    if (memberName.trim() === '') return;

    const updatedGroup = await addMember(groupId, { name: memberName });
    const updatedGroups = groups.map((group) =>
      group._id === updatedGroup._id ? updatedGroup : group
    );
    setGroups(updatedGroups);
    setMemberName('');
  };

  const handleSelectContact = (contact) => {
    setCurrentContact(contact);
    setMessages([]); // Clear messages or fetch new ones for the selected contact
    socket.emit('joinGroup', contact._id); // Join the selected group
  };
  return (
    <div className="main-app">
      <AllRoutes />
      {/* <Chat /> */}
      <div className="app">
        <AppModal handleClose={() => { setIsOpenAddMember(!isOpenAddMember) }} isOpen={isOpenAddMember} title={"Add Members"}>
          <MultipleSelectChip />
        </AppModal>
        <div className="sidebar">
          <ContactList contacts={contacts}
            onSelectContact={handleSelectContact}
            handleCreateGroup={handleCreateGroup}
            handleAddMember={handleAddMember}
            groupName={groupName}
            setGroupName={setGroupName}
            isOpenCreateGroup={isOpenCreateGroup}
            setIsOpenCreateGroup={setIsOpenCreateGroup}
          />
        </div>
        <div className="chat-container">
          <ChatWindow messages={messages} currentContact={currentContact} setIsOpenAddMember={setIsOpenAddMember} />
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default App;
