import '@/styles/loader.css';

const Loader = () => {
    return (
        <div className='loader-background'>
            <div className='loader-ring' >
                <div className='loader-ring-light' ></div>
                <div className='loader-ring-track' ></div>
            </div>
        </div>
    );
};

export default Loader;
