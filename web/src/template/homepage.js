import React from 'react'
import { Link } from 'react-router-dom'
import './homepageStyle.css'

export const Homepage = () => {
    return (
        <div className='homepage d-flex justify-content-center align-items-center'>
            <div className='homepageContent'>
                <h2 className='text-success bg-white homepageTitle px-3 py-2 rounded-4'>Chào mừng đến với Hệ thống quản lý vườn thông minh</h2>
                <div className='d-flex justify-content-center mt-5'>
                    <div className='buttonContainer'>
                        <Link to='/login' className='btn primaryButton'>Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}