import React from 'react'
import './index.scss'

export default function LineText({ label }) {
    return (
        <div class="line-around">
            <hr className='border ' />
            <h1 class="text-gray-600">{label}</h1>
            <hr />
        </div>
    )
}
