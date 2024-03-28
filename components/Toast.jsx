import React from 'react'
import styles from './components.module.css'

const Toast = ({error}) => {
  return (
    <div className={`w-max flex justify-between items-center p-3 fixed bottom-4 ${styles.status} left-1/2 -translate-x-1/2 bg-black rounded-md`}>
        <div className="size-5 rounded-full border-2 border-black border-t-white border-b-white animate-spin"/>
        <p className="p-2 text-white text-base font-normal">{error}</p>
    </div>
  )
}

export default Toast