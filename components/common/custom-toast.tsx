"use client"

import { toast, Toaster, ToastBar } from 'react-hot-toast';

export default function CustomToaster() {
    return <Toaster>
        {(t) => (
            <ToastBar toast={t}>
                {({ icon, message }) => (
                    <div onClick={() => toast.dismiss(t.id)} className='flex'>
                        {icon}
                        {message}
                    </div>
                )}
            </ToastBar>
        )}
    </Toaster>;
}