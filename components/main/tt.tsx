"use client"
import React, { useEffect } from 'react';

const LiAds = () => {
  useEffect(() => {
    const speedUpdate = () => {
      const ranger: HTMLInputElement | null = document.querySelector('#speed');
      if (ranger) {
        document.documentElement.style.setProperty('--speed', `${ranger.value}s`);
      }
    };

    const ranger = document.querySelector('#speed');
    if (ranger) {
      ranger.addEventListener('input', speedUpdate);
    }

    return () => {
      if (ranger) {
        ranger.removeEventListener('input', speedUpdate);
      }
    };
  }, []);

  return (
    <main>
   <article>
     <div className="window">
       <div className="scene">
         <ul className="grid3">
           <li>
             <div className="item !bg-card-gradient">
               {/* <div className="item__icon">
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 24 24"
                   fill="currentColor"
                   className="w-6 h-6"
                 >
                   <path
                     fill-rule="evenodd"
                     d="M17.834 6.166a8.25 8.25 0 1 0 0 11.668.75.75 0 0 1 1.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0 1 21.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 1 1-.82-6.26V8.25a.75.75 0 0 1 1.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 0 0-2.416-5.834ZM15.75 12a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0Z"
                     clip-rule="evenodd"
                   />
                 </svg>
               </div> */}
               <div className="item__text text-muted-foreground">jh3yy</div>
             </div>
           </li>
           <li>
             <div className="item !bg-card-gradient">
 
               <div className="item__text text-muted-foreground">Creative</div>
             </div>
           </li>
           <li>
             <div className="item !bg-card-gradient">
             
               <div className="item__text text-muted-foreground">Performant</div>
             </div>
           </li>
           <li>
             <div className="item !bg-card-gradient">
              
               <div className="item__text text-muted-foreground">Bookmark</div>
             </div>
           </li>
           <li>
             <div className="item !bg-card-gradient">
            
               <div className="item__text text-muted-foreground">Share</div>
             </div>
           </li>
           <li>
             <div className="item !bg-card-gradient">

               <div className="item__text text-muted-foreground">CSS!</div>
             </div>
           </li>
           <li>
             <div className="item !bg-card-gradient">
           
               <div className="item__text text-muted-foreground">Responsive</div>
             </div>
           </li>
           <li>
             <div className="item !bg-card-gradient">
              
               <div className="item__text text-muted-foreground">Profit</div>
             </div>
           </li>
           <li>
             <div className="item !bg-card-gradient">
             
               <div className="item__text text-muted-foreground">Like</div>
             </div>
           </li>
           <li>
             <div className="item !bg-card-gradient">
               
               <div className="item__text text-muted-foreground">Hover</div>
             </div>
           </li>
           <li>
             <div className="item !bg-card-gradient">
               
               <div className="item__text text-muted-foreground">Gift</div>
             </div>
           </li>
           <li>
             <div className="item !bg-card-gradient">
              
               <div className="item__text text-muted-foreground">Configurable</div>
             </div>
           </li>
         </ul>
       </div>
     </div>
   </article>
    </main>
  );
};

export default LiAds;
