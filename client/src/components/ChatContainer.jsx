import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const ChatContainer = () => {

    const {messages, selectedUser, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext);
    const {authUser, onlineUsers} = useContext(AuthContext);

    const scrollEnd = useRef();

    const [input, setInput] = useState('');

    // handle sending a message
    const handleSendMessage = async(e)=>{
        e.preventDefault();
        if(input.trim() === "") return null;
        console.log(`input - ${input.trim()}`)
        await sendMessage({text: input.trim()});
        console.log(`input send===`)
        setInput("");
    }

    // handle sending an image
    const handleSendImage = async(e)=>{
        const file = e.target.files[0];
        if(!file || !file.type.startsWith("image/")){
            toast.error("Select an image file");
            return;
        }
        const reader = new FileReader();

        reader.onloadend = async ()=>{
            await sendMessage({image: reader.result});
            e.target.value = "";
        }
        reader.readAsDataURL(file);
    }

    useEffect(()=>{
        if(selectedUser){
            getMessages(selectedUser._id);
        }
    },[selectedUser]);

    useEffect(()=>{
        if(scrollEnd.current && messages){
            scrollEnd.current.scrollIntoView({behavior: "smooth"});
        }
    },[messages]);

    console.log("Messages :- "+ messages);

    return selectedUser 
    ? 
    (
        <div className='h-full overflow-scroll relative backdrop-blur-lg'>

            {/* -------------header------------- */}
            <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
                <img src={selectedUser.profilePic || assets.avatar_icon} alt=""  className='w-8 rounded-full'/>
                <p className='flex-1 flex items-center gap-2 text-gray-900 text- font-extrabold tracking-wide drop-shadow-sm'>
                    {selectedUser.fullName}
                    {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-700'></span>}
                </p>
                <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/>
                <img src={assets.help_icon} alt="" className='bg-black rounded-full max-md:hidden max-w-6'/>
            </div>

            {/*---------------chat area---------------  */}
            <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
                    {messages.map((msg, index)=>(
                        <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                            {msg.image ? (
                                <img src= {msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>
                            ) : (
                                <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/70 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                            )}

                            <div className='text-center text-xs'>
                                <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full'/>
                                <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
                            </div>

                        </div>
                    ))}

                <div ref={scrollEnd}></div>
                    
            </div>

            {/* ------------bottom area----------- */}
            <div className='absolut bottom-0 left-0 right-0 flex items-center gap-3'>
                <div className='bg-[#282142] ml-1 rounded-full flex-1 flex items-center px-3 rounded-full'>
                    <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder='Send a message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
                    <input onChange={handleSendImage} type='file' id='image' accept='image/png, image/jpeg' hidden/>
                    <label htmlFor='image'>
                        <img src={assets.gallery_icon} alt="" className='rounded bg-gray-700 w-6 cursor-pointer'/>
                    </label>
                </div>
                <img onClick={handleSendMessage} src={assets.send_button} className='w-10 rounded-full cursor-pointer'/>
            </div>
        </div>
    )
    : 
    (
        <div className='flex flex-col items-center justify-center gap-2 text-gray-600 bg-white/10 max-md:hidden'>
            <h1 className=' text-4xl font-extrabold tracking-wide'>Chattrix</h1>
            <p className='text-lg font-medium'>Chat Beyond Borders.</p>
        </div>
    )

}

export default ChatContainer;