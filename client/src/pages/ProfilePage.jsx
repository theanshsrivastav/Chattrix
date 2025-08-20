import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { useContext } from 'react';
import {AuthContext} from "../../context/AuthContext";

const ProfilePage = () => {

    const {authUser, updateProfile} = useContext(AuthContext);

    const [selectedImg, setSelectedImg] = useState(null);
    const navigate = useNavigate();
    const [name, setName] = useState(authUser.fullName);
    const [bio, setBio] = useState(authUser.bio);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(!selectedImg){
            await updateProfile({fullName: name, bio});
            console.log("after updating profile")
            navigate('/');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        reader.onload = async ()=>{
            const base64Image = reader.result;
            await updateProfile({profilePic: base64Image, fullName: name, bio});
            navigate('/');
        }
    }

    return (
        <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
            <div className='w-5/6 max-w-2xl backdrop-blur-2xl border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
                    <h3 className='text-lg'>Profile details</h3>
                    <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer'>
                        <input onChange={(e)=>{setSelectedImg(e.target.files[0])}} type='file' id='avatar' accept='.png, .jpg, .jpeg' hidden/>
                        <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
                        upload profile image
                    </label>
                    <input onChange={(e)=>{setName(e.target.value)}} value={name} type="text" required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
                    <textarea onChange={(e)=>{setBio(e.target.value)}} value={bio} placeholder='Write profile bio' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea> 
                    <button type="submit" className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
                </form>
                {/* <img src={assets.logo_icon} alt="" /> */}
                {authUser?.profilePic ? (
                    <img
                        src={authUser.profilePic}
                        alt="Profile"
                        className="p-5 max-w-50 rounded-full object-cover"
                    />
                ) : (
                <div className='p-10 flex flex-col items-center justify-center gap-2 text-gray-600 bg-white/10 max-md:hidden'>
                    <h1 className=' text-4xl font-extrabold tracking-wide'>Chattrix</h1>
                    <p className='text-lg font-medium'>Chat Beyond Borders.</p>
                </div>
                )}
            </div>
        </div>
    )
}

export default ProfilePage;