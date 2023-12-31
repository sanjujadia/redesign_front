import React, { useState, useEffect, useRef } from 'react';
// import Sidebar from '../components/Sidebar';
// import TopBar from '../components/TopBar';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom';


export default function AddVideo() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [showVideoModal, setShowVideoModal] = useState(false)
    const [videos, setVideos] = useState([])
    const [videoTitle, setVideoTitle] = useState('')
    const [videoUrl, setVideoUrl] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [description, setDescription] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const fileInputRef = useRef(null)

    const handleAddVideo = async (e) => {
        e.preventDefault()
        let formdata = new FormData();
        formdata.append('videoTitle', videoTitle);
        formdata.append('videoUrl', videoUrl);
        formdata.append('description', description);
        formdata.append('videoThumbnail', selectedFile);

        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/addHowToVideo`, {
            method: 'POST',
            body: formdata
        }).then(res => res.json())

        if (res.status) {
            setVideos(current => [...current, res.data])
            setVideoTitle('')
            setVideoUrl('')
            setDescription('')
            setThumbnail('')
            setSelectedFile(null)
            setShowVideoModal(false)
            navigate('/how-to-videos')
        }
    }

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
            setThumbnail(URL.createObjectURL(file))
            // Use createObjectURL with the 'file' object
            // const url = URL.createObjectURL(file);
            // ... rest of your code
        }
    };

    const handleImageClick = () => {
        // Trigger a click event on the hidden file input when the image is clicked
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger file input click when image is clicked
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        } else {

        }
    }, [])

    return (
        <div>
            <div className='dashboard-layout'>
                {/* <div><Sidebar user={user} /></div> */}
                <div className='dashboard-content'>
                    {/* <TopBar /> */}
                    <div className='mt-1 main-content'>
                        <div className='p-xl-5 p-3'>
                            <Row className='align-items-center h-75vh'>
                                <Col lg={8} className='mx-auto'>
                                    <div className='text-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="184" height="106" viewBox="0 0 184 106" fill="none">
                                            <path d="M33.1265 49.7936C33.1265 49.7936 38.8536 58.7138 41.9453 82.0787" stroke="#787E76" stroke-miterlimit="10" />
                                            <path d="M35.6175 54.5252C35.6175 54.5252 40.6858 58.8839 43.9802 54.5252C47.3253 50.1664 43.5747 42.2599 42.0035 40.9928C40.4324 39.7257 36.8339 39.7257 35.4147 36.8875C33.9449 34.0492 31.1574 36.5327 27.3561 33.3397C23.5042 30.1466 20.666 32.6808 18.0305 30.3494C15.3949 28.018 15.547 38.9148 17.8277 41.8544C20.1085 44.7434 17.6757 51.6869 21.0714 51.6363C24.5179 51.5349 20.2098 58.7319 26.0891 61.5701C31.9176 64.3577 35.4654 56.958 35.6175 54.5252Z" fill="#CCFFCE" />
                                            <path d="M17.0166 31.3124C17.0166 31.3124 17.3714 31.6165 17.9796 32.1741C18.5878 32.7316 19.3987 33.5425 20.4124 34.5562C21.426 35.5698 22.5411 36.7355 23.7574 38.0026C24.9738 39.2697 26.1902 40.6888 27.4066 42.1079C28.0148 42.8175 28.5723 43.5271 29.1805 44.2366C29.738 44.9462 30.2956 45.7064 30.8024 46.3653C31.3092 47.0749 31.8161 47.7844 32.2722 48.4433C32.7283 49.1022 33.1338 49.7611 33.4886 50.3693C33.8434 50.9775 34.1475 51.535 34.4516 52.0418C34.7557 52.5486 34.9584 53.0048 35.1105 53.3596C35.4652 54.1198 35.668 54.5253 35.668 54.5253C35.668 54.5253 35.5159 54.0691 35.2118 53.3089C35.0598 52.9034 34.9077 52.4473 34.6543 51.9404C34.4009 51.4336 34.1475 50.8254 33.7927 50.2172C33.4379 49.609 33.0324 48.9501 32.627 48.2406C32.1708 47.5817 31.7147 46.8215 31.2079 46.1119C30.701 45.4023 30.1435 44.6421 29.586 43.9325C29.0285 43.223 28.4203 42.4627 27.8121 41.7532C26.5957 40.334 25.3286 38.9149 24.1122 37.6478C23.504 36.9889 22.8958 36.4314 22.3383 35.8739C21.7301 35.3164 21.1726 34.8096 20.6658 34.3027C19.6521 33.3398 18.7398 32.5795 18.0809 32.0727C17.4221 31.5659 17.0166 31.3124 17.0166 31.3124Z" fill="#787E76" />
                                            <path d="M34.8564 52.7007C34.8564 52.7007 34.9071 52.498 35.0085 52.1939C35.1099 51.8391 35.2619 51.383 35.414 50.8254C35.566 50.2679 35.8194 49.6597 36.0728 48.9502C36.2249 48.5954 36.3769 48.2913 36.529 47.9365C36.681 47.5817 36.8838 47.2776 37.0358 46.9228C37.1879 46.5681 37.4413 46.264 37.5933 45.9599C37.7961 45.6558 37.9988 45.3517 38.2522 45.0476C38.5056 44.7942 38.7084 44.4901 38.9111 44.2873C39.1645 44.0846 39.3672 43.8312 39.57 43.6791C39.8234 43.5271 40.0261 43.375 40.1782 43.223C40.3809 43.0709 40.5836 43.0202 40.685 42.9189C40.9891 42.7668 41.1411 42.6655 41.1411 42.6655C41.1411 42.6655 40.9384 42.7162 40.6343 42.8175C40.4823 42.8682 40.2795 42.9189 40.0768 43.0203C39.8741 43.1216 39.6206 43.2737 39.3672 43.4257C39.1138 43.5778 38.8604 43.7805 38.607 43.9832C38.3536 44.186 38.1002 44.4901 37.8467 44.7435C37.5933 45.0476 37.3906 45.3517 37.1372 45.6558C36.9345 46.0105 36.681 46.3146 36.529 46.6694C36.1742 47.379 35.8194 48.0886 35.6167 48.7981C35.3633 49.5077 35.2112 50.1666 35.1099 50.7241C34.9071 51.9405 34.8564 52.7007 34.8564 52.7007Z" fill="#787E76" />
                                            <path d="M33.7921 50.6228C33.7921 50.6228 33.1839 50.2173 32.1195 49.8625C31.6127 49.7105 30.9538 49.5077 30.2949 49.3557C29.9402 49.305 29.5854 49.2036 29.2306 49.2036C28.8758 49.153 28.4703 49.153 28.1156 49.1023C27.7608 49.1023 27.3553 49.1023 27.0005 49.1023C26.6458 49.1023 26.291 49.153 25.9362 49.153C25.5814 49.2036 25.2773 49.2543 24.9225 49.305C24.6184 49.3557 24.3143 49.4064 24.0609 49.4571C23.5034 49.5584 23.0473 49.7105 22.7432 49.8118C22.4391 49.9132 22.2363 49.9639 22.2363 49.9639C22.2363 49.9639 22.4391 49.9639 22.7432 49.9132C22.8952 49.9132 23.0979 49.8625 23.3007 49.8118C23.5034 49.7612 23.7568 49.7612 24.0609 49.7105C24.3143 49.7105 24.6184 49.6598 24.9225 49.6091C25.2266 49.6091 25.5814 49.5584 25.8855 49.5584C26.5444 49.5584 27.3046 49.5077 28.0142 49.5584C28.369 49.6091 28.7238 49.6091 29.0785 49.6598C29.4333 49.7105 29.7881 49.7105 30.1429 49.7612C30.8018 49.8625 31.4606 49.9639 31.9675 50.1159C32.525 50.2173 32.9305 50.3693 33.2345 50.4707C33.64 50.5721 33.7921 50.6228 33.7921 50.6228Z" fill="#787E76" />
                                            <path d="M31.5624 46.6693C31.5624 46.6693 31.5117 46.1118 31.6131 45.2502C31.6638 44.8447 31.7144 44.3379 31.8665 43.8818C31.9172 43.6283 32.0185 43.3749 32.0692 43.1215C32.1199 42.8681 32.272 42.6147 32.3226 42.3613C32.424 42.1079 32.5254 41.8544 32.6267 41.601C32.7281 41.3476 32.8802 41.1449 32.9815 40.8915C33.2349 40.4353 33.4884 40.0299 33.7418 39.6751C33.9445 39.3203 34.1979 39.0162 34.2993 38.8135C34.4513 38.6107 34.502 38.5094 34.502 38.5094C34.502 38.5094 34.4007 38.6107 34.1979 38.7628C33.9952 38.9148 33.7418 39.1682 33.4377 39.4723C33.1336 39.7764 32.8295 40.1819 32.5254 40.638C32.3733 40.8915 32.2213 41.0942 32.1199 41.3476C32.0185 41.601 31.8665 41.8544 31.7651 42.1585C31.6638 42.412 31.5624 42.7161 31.5117 42.9695C31.461 43.2229 31.3597 43.527 31.3597 43.7804C31.2583 44.3379 31.2583 44.8447 31.2583 45.2502C31.3597 46.1625 31.5624 46.6693 31.5624 46.6693Z" fill="#787E76" />
                                            <path d="M29.8895 44.49C29.8895 44.49 29.3827 44.1352 28.5718 43.7297C27.7102 43.375 26.5445 43.0709 25.2774 42.9695C24.9733 42.9695 24.6692 42.9695 24.3651 42.9695C24.061 42.9695 23.7569 43.0202 23.5035 43.0202C23.1994 43.0709 22.946 43.1215 22.6926 43.1722C22.4391 43.2229 22.1857 43.2736 21.983 43.375C21.7803 43.4256 21.5775 43.4763 21.3748 43.5777C21.2227 43.6284 21.0707 43.7297 20.9186 43.7804C20.6652 43.8818 20.5132 43.9325 20.5132 43.9325C20.5132 43.9325 20.6652 43.9325 20.9186 43.8818C21.0707 43.8818 21.2227 43.8311 21.3748 43.7804C21.5775 43.7297 21.7803 43.7297 21.983 43.6791C22.1857 43.6284 22.4391 43.6284 22.6926 43.5777C22.946 43.5777 23.1994 43.527 23.5035 43.527C24.061 43.527 24.6692 43.4763 25.2267 43.527C25.8349 43.5777 26.3924 43.6284 26.9499 43.7297C27.5074 43.8311 28.0143 43.9325 28.4197 44.0338C29.332 44.2873 29.8895 44.49 29.8895 44.49Z" fill="#787E76" />
                                            <path d="M26.3928 40.5367C26.3928 40.5367 26.3421 40.1312 26.3421 39.523C26.2914 38.9148 26.2407 38.1039 26.2407 37.2929C26.2407 36.482 26.2914 35.6711 26.3421 35.1136C26.3421 34.8095 26.3928 34.5561 26.3928 34.3533C26.3928 34.1506 26.3928 34.0492 26.3928 34.0492C26.3928 34.0492 26.3421 34.1506 26.2914 34.3026C26.2407 34.4547 26.0887 34.7081 26.038 35.0122C25.9366 35.3163 25.8859 35.6711 25.8353 36.0766C25.7846 36.482 25.7339 36.8875 25.7339 37.2929C25.7339 38.1039 25.8859 38.9655 26.038 39.5737C26.19 40.1312 26.3928 40.5367 26.3928 40.5367Z" fill="#787E76" />
                                            <path d="M25.1765 39.2189C25.1765 39.2189 24.8217 38.8641 24.1121 38.5093C23.7574 38.3066 23.4026 38.1039 22.9464 37.9518C22.4903 37.7491 22.0341 37.6477 21.5273 37.4957C21.0205 37.3943 20.5136 37.293 20.0575 37.2423C19.6013 37.1916 19.1452 37.1916 18.7397 37.1916C18.3343 37.1916 18.0302 37.2423 17.8274 37.2423C17.6247 37.293 17.4727 37.2929 17.4727 37.2929C17.4727 37.2929 17.574 37.2929 17.8274 37.3436C18.0302 37.3436 18.3343 37.3943 18.7397 37.445C19.5 37.5464 20.463 37.6984 21.4259 37.9518C21.8821 38.0532 22.3889 38.2052 22.8451 38.3066C23.3012 38.4586 23.7067 38.56 24.0615 38.7121C24.7203 39.0162 25.1765 39.2189 25.1765 39.2189Z" fill="#787E76" />
                                            <path d="M35.4649 54.0692C35.4649 54.0692 34.7554 53.9172 33.6403 53.9172C33.0828 53.9172 32.4746 53.9678 31.7651 54.0692C31.4103 54.1199 31.0555 54.2213 30.7514 54.3226C30.3966 54.424 30.0418 54.5254 29.7377 54.6774C29.383 54.8295 29.0789 54.9815 28.7241 55.1336C28.3693 55.2856 28.1159 55.4883 27.8118 55.6911C27.5077 55.8431 27.2543 56.0965 27.0009 56.2993C26.7474 56.502 26.5447 56.7047 26.342 56.9075C26.1392 57.1102 25.9872 57.2622 25.8352 57.465C25.6831 57.6677 25.5817 57.8198 25.4804 57.9211C25.2776 58.1745 25.1763 58.3266 25.1763 58.3266C25.1763 58.3266 25.3283 58.2252 25.531 57.9718C25.6324 57.8704 25.7845 57.7184 25.9365 57.5663C26.0886 57.4143 26.2913 57.2622 26.494 57.1102C26.6968 56.9075 26.8995 56.7554 27.1529 56.6034C27.4063 56.4513 27.6597 56.2486 27.9638 56.0965C28.2679 55.9445 28.5214 55.7417 28.8761 55.6404C29.1802 55.4883 29.4843 55.3363 29.8391 55.2349C30.498 54.9815 31.1569 54.7788 31.8158 54.6267C32.1199 54.576 32.4746 54.4747 32.728 54.424C33.0321 54.3733 33.3362 54.3226 33.5897 54.2719C34.0965 54.2212 34.5526 54.1706 34.8567 54.1706C35.2622 54.0692 35.4649 54.0692 35.4649 54.0692Z" fill="#787E76" />
                                            <path d="M49.8616 52.6498C49.8616 52.6498 42.6646 64.7631 41.1948 85.2897" stroke="#787E76" stroke-miterlimit="10" />
                                            <path d="M54.9283 62.8879C59.4897 60.7085 56.1447 55.1334 58.7802 55.2347C61.4664 55.2854 59.5404 49.913 61.3143 47.6829C63.0882 45.4529 63.2403 36.9888 61.1623 38.7627C59.0843 40.5873 56.9049 38.56 53.9146 41.0435C50.9243 43.5269 48.7956 41.601 47.6806 43.7804C46.5656 45.9597 43.778 45.9597 42.5616 46.9227C41.3452 47.8857 38.4563 54.069 41.0411 57.4141C43.626 60.7592 47.5285 57.4141 47.5285 57.4141C47.6299 59.3907 50.3668 65.0672 54.9283 62.8879Z" fill="#DAFFD0" />
                                            <path d="M61.9234 39.5231C61.9234 39.5231 61.67 39.7765 61.2138 40.1819C60.7577 40.5874 60.0988 41.2463 59.3385 42.0065C58.5783 42.7668 57.666 43.6791 56.7537 44.6927C55.8414 45.6557 54.8784 46.7707 53.9155 47.8858C53.4086 48.4433 53.0032 49.0008 52.547 49.5583C52.0909 50.1158 51.6854 50.6733 51.2799 51.2308C50.8745 51.7883 50.5197 52.2952 50.1649 52.8527C49.8101 53.3595 49.506 53.8664 49.2019 54.3225C48.9485 54.7786 48.6951 55.2348 48.4924 55.5896C48.239 55.9444 48.1376 56.2991 47.9855 56.6032C47.7321 57.1607 47.5801 57.5155 47.5801 57.5155C47.5801 57.5155 47.7321 57.1607 47.9349 56.6032C48.0362 56.2991 48.1883 55.9444 48.391 55.5389C48.5937 55.1334 48.7965 54.6773 49.0499 54.2211C49.3033 53.765 49.6074 53.2582 49.9622 52.7006C50.317 52.1938 50.6717 51.6363 51.0772 51.0788C51.4827 50.5213 51.8881 49.9638 52.3443 49.4063C52.8004 48.8487 53.2059 48.2405 53.7127 47.7337C54.6757 46.6187 55.6387 45.5543 56.6017 44.5914C57.0578 44.0845 57.5646 43.6284 57.9701 43.2229C58.4263 42.8174 58.8317 42.412 59.2372 42.0065C60.0481 41.2463 60.7577 40.6888 61.2138 40.2833C61.6193 39.7258 61.9234 39.5231 61.9234 39.5231Z" fill="#787E76" />
                                            <path d="M48.0872 56.0963C48.0872 56.0963 48.0365 55.9442 47.9858 55.6908C47.9351 55.4374 47.7831 55.0826 47.6817 54.6265C47.5296 54.221 47.3776 53.7142 47.1749 53.2074C47.0735 52.9539 46.9721 52.7005 46.8201 52.3964C46.7187 52.143 46.5667 51.8896 46.4146 51.5855C46.2626 51.3321 46.1105 51.0787 45.9585 50.8252C45.8064 50.5718 45.6544 50.3691 45.4516 50.1157C45.2489 49.9129 45.0969 49.7102 44.9448 49.5075C44.7421 49.3554 44.59 49.1527 44.438 49.0513C44.2352 48.95 44.0832 48.7979 43.9311 48.6965C43.7791 48.5952 43.627 48.5445 43.5257 48.4431C43.2723 48.2911 43.1709 48.2404 43.1709 48.2404C43.1709 48.2404 43.3229 48.2911 43.5764 48.3925C43.6777 48.4431 43.8805 48.4938 44.0325 48.5445C44.1846 48.6459 44.3873 48.7472 44.59 48.8486C44.7928 48.95 44.9955 49.1527 45.1982 49.3047C45.401 49.4568 45.6037 49.6595 45.8064 49.8623C46.0091 50.065 46.1612 50.3184 46.3639 50.5718C46.516 50.8252 46.7187 51.0787 46.8201 51.3321C47.1242 51.8896 47.3776 52.4471 47.5296 52.9539C47.7324 53.5114 47.8337 54.0183 47.9351 54.4744C48.0872 55.4881 48.0872 56.0963 48.0872 56.0963Z" fill="#787E76" />
                                            <path d="M48.9487 54.4745C48.9487 54.4745 49.4556 54.1704 50.2665 53.8663C50.672 53.7142 51.1788 53.5622 51.6856 53.4608C51.939 53.4101 52.2431 53.3595 52.4965 53.3088C52.8006 53.2581 53.0541 53.2581 53.3582 53.2074C53.6623 53.2074 53.9157 53.2074 54.2198 53.2074C54.5239 53.2074 54.7773 53.2581 55.0307 53.2581C55.2841 53.2581 55.5375 53.3088 55.7909 53.3595C56.0444 53.4101 56.2471 53.4608 56.5005 53.5115C56.906 53.6129 57.2608 53.7142 57.5142 53.7649C57.7676 53.8663 57.869 53.8663 57.869 53.8663C57.869 53.8663 57.7169 53.8663 57.4635 53.8156C57.3621 53.8156 57.2101 53.7649 57.0073 53.7649C56.8553 53.7142 56.6526 53.7142 56.4498 53.7142C56.2471 53.7142 55.9937 53.6636 55.7909 53.6636C55.5375 53.6636 55.2841 53.6129 55.0307 53.6129C54.5239 53.6129 53.9157 53.6129 53.3582 53.6129C53.0541 53.6129 52.8006 53.6129 52.4965 53.6636C52.2431 53.7142 51.939 53.7142 51.6856 53.7649C51.1788 53.8156 50.672 53.917 50.2665 54.0183C49.861 54.1197 49.5062 54.2211 49.2528 54.2717C49.0501 54.4238 48.9487 54.4745 48.9487 54.4745Z" fill="#787E76" />
                                            <path d="M50.6723 51.4335C50.6723 51.4335 50.723 50.9774 50.6217 50.3692C50.571 50.0651 50.5203 49.6596 50.4189 49.3048C50.3682 49.1021 50.3176 48.8993 50.2669 48.6966C50.2162 48.4939 50.1148 48.2912 50.0641 48.0884C49.9628 47.8857 49.9121 47.683 49.8107 47.4802C49.7094 47.2775 49.608 47.1254 49.5573 46.9227C49.3546 46.5679 49.1518 46.2638 48.9998 45.9597C48.8477 45.7063 48.645 45.4529 48.5437 45.3009C48.4423 45.1488 48.3916 45.0474 48.3916 45.0474C48.3916 45.0474 48.493 45.0981 48.645 45.2502C48.7971 45.4022 48.9998 45.5543 49.2025 45.8077C49.4559 46.0611 49.6587 46.3652 49.9121 46.72C50.0135 46.9227 50.1148 47.0748 50.2162 47.2775C50.3176 47.4802 50.4189 47.683 50.4696 47.8857C50.5203 48.0884 50.6217 48.2912 50.6723 48.5446C50.723 48.7473 50.7737 48.95 50.8244 49.1528C50.8751 49.5582 50.9258 49.9637 50.8751 50.3185C50.8244 50.9774 50.6723 51.4335 50.6723 51.4335Z" fill="#787E76" />
                                            <path d="M51.9385 49.7103C51.9385 49.7103 52.2933 49.4062 52.9521 49.1528C53.611 48.8487 54.5233 48.6459 55.4863 48.5952C55.7397 48.5952 55.9424 48.5952 56.1958 48.5952C56.4493 48.5952 56.652 48.6459 56.9054 48.6459C57.1081 48.6459 57.3616 48.6966 57.5136 48.7473C57.7163 48.798 57.9191 48.8487 58.0711 48.8993C58.2232 48.95 58.3752 49.0007 58.5273 49.0514C58.6793 49.1021 58.7807 49.1527 58.8821 49.2034C59.0848 49.3048 59.1862 49.3555 59.1862 49.3555C59.1862 49.3555 59.0848 49.3555 58.8821 49.3048C58.7807 49.3048 58.6793 49.2541 58.5273 49.2541C58.3752 49.2034 58.2232 49.2034 58.0711 49.2034C57.9191 49.2034 57.7163 49.1528 57.5136 49.1528C57.3109 49.1528 57.1081 49.1021 56.9054 49.1021C56.5 49.1021 56.0438 49.0514 55.5877 49.1021C55.1315 49.1021 54.6754 49.1528 54.2699 49.2541C53.8644 49.3048 53.459 49.4062 53.1042 49.5075C52.3946 49.5582 51.9385 49.7103 51.9385 49.7103Z" fill="#787E76" />
                                            <path d="M54.6758 46.6187C54.6758 46.6187 54.6758 46.3146 54.7265 45.8078C54.7772 45.3516 54.7771 44.6927 54.7771 44.0845C54.7771 43.4763 54.7772 42.8681 54.7265 42.3613C54.7265 42.1079 54.6758 41.9052 54.6758 41.8038C54.6758 41.6518 54.6758 41.6011 54.6758 41.6011C54.6758 41.6011 54.7265 41.6518 54.7771 41.8038C54.8278 41.9559 54.9292 42.1079 54.9799 42.3613C55.0306 42.6147 55.1319 42.8681 55.1319 43.1722C55.1826 43.4763 55.1826 43.7804 55.1826 44.1352C55.1826 44.7941 55.0812 45.4023 54.9292 45.8584C54.8278 46.3653 54.6758 46.6187 54.6758 46.6187Z" fill="#787E76" />
                                            <path d="M55.5884 45.6051C55.5884 45.6051 55.8925 45.3516 56.3993 45.0475C56.6527 44.8955 56.9568 44.7435 57.3116 44.5914C57.6664 44.4394 58.0212 44.338 58.4266 44.2366C58.8321 44.1352 59.1869 44.0846 59.5923 44.0339C59.9471 43.9832 60.3019 43.9832 60.606 43.9832C60.9101 43.9832 61.1635 44.0339 61.3156 44.0339C61.4676 44.0339 61.569 44.0846 61.569 44.0846C61.569 44.0846 61.4676 44.0846 61.3156 44.1352C61.1635 44.1352 60.9101 44.1859 60.606 44.2366C60.0485 44.338 59.2882 44.4393 58.528 44.6421C58.1732 44.7434 57.7677 44.8448 57.4637 44.9462C57.1089 45.0475 56.8048 45.1489 56.5514 45.2503C55.9432 45.453 55.5884 45.6051 55.5884 45.6051Z" fill="#787E76" />
                                            <path d="M47.6313 57.1101C47.6313 57.1101 48.1889 56.9581 49.0505 57.0088C49.4559 57.0088 49.9628 57.0594 50.4696 57.1608C50.723 57.2115 50.9764 57.2622 51.2805 57.3635C51.5339 57.4649 51.838 57.5156 52.0915 57.617C52.3449 57.7183 52.5983 57.8197 52.8517 57.9717C53.1051 58.0731 53.3585 58.2252 53.5613 58.3772C53.8147 58.5293 53.9667 58.6813 54.1695 58.8333C54.3722 58.9854 54.5242 59.1375 54.6763 59.2895C54.8283 59.4416 54.9804 59.5936 55.0818 59.695C55.1831 59.847 55.2845 59.9484 55.3352 60.0498C55.4872 60.2525 55.5379 60.3538 55.5379 60.3538C55.5379 60.3538 55.4365 60.2525 55.2845 60.1004C55.1831 59.9991 55.0818 59.8977 54.9804 59.7963C54.879 59.695 54.6763 59.5936 54.5242 59.4416C54.3722 59.2895 54.2201 59.1881 54.0174 59.0361C53.8147 58.884 53.6119 58.7827 53.4092 58.6306C53.2065 58.4786 52.9531 58.3772 52.6997 58.2758C52.4462 58.1745 52.1928 58.0224 51.9394 57.9717C51.4326 57.769 50.9257 57.617 50.4189 57.5156C50.1655 57.4649 49.9121 57.4142 49.7093 57.3635C49.4559 57.3129 49.2532 57.2622 49.0505 57.2622C48.645 57.2115 48.2902 57.1608 48.0368 57.1608C47.7834 57.1101 47.6313 57.1101 47.6313 57.1101Z" fill="#787E76" />
                                            <path d="M57.8671 74.3931H27.3052V78.4477H57.8671V74.3931Z" fill="#DAFFD0" />
                                            <path d="M52.8997 100.241H32.3224L29.6362 78.4478H55.586L52.8997 100.241Z" fill="#80BE4F" />
                                            <ellipse cx="91.5847" cy="102.269" rx="91.5847" ry="2.92292" fill="#E9EBE7" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M153.444 100.847C153.444 100.847 148.933 96.1332 150.96 87.1623C150.96 87.1623 148.122 81.131 152.43 76.7216C152.43 76.7216 151.264 69.6766 157.042 66.4836C157.042 66.4836 157.498 62.1249 161.148 58.425V100.796H153.444V100.847Z" fill="#DAFFD0" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M168.902 100.847C168.902 100.847 173.412 96.1332 171.385 87.1623C171.385 87.1623 174.223 81.131 169.915 76.7216C169.915 76.7216 171.081 69.6767 165.303 66.4836C165.303 66.4836 164.847 62.1249 161.198 58.425V100.796H168.902V100.847Z" fill="#B8F5A8" />
                                            <path d="M133.917 73C130.259 73 126.751 74.4529 124.166 77.0393C121.579 79.625 120.126 83.1326 120.126 86.7902C120.126 90.4477 121.579 93.9553 124.166 96.541C126.751 99.1275 130.259 100.58 133.917 100.58C137.574 100.58 141.082 99.1275 143.667 96.541C146.254 93.9553 147.707 90.4477 147.707 86.7902C147.703 83.134 146.249 79.6287 143.663 77.0439C141.078 74.4582 137.573 73.0037 133.917 73ZM140.812 88.5139H135.64V93.6853C135.64 94.6372 134.869 95.409 133.917 95.409C132.965 95.409 132.193 94.6372 132.193 93.6853V88.5139H127.022C126.07 88.5139 125.298 87.7421 125.298 86.7902C125.298 85.8383 126.07 85.0664 127.022 85.0664H132.193V79.8951C132.193 78.9432 132.965 78.1713 133.917 78.1713C134.869 78.1713 135.64 78.9432 135.64 79.8951V85.0664H140.812C141.764 85.0664 142.535 85.8383 142.535 86.7902C142.535 87.7421 141.764 88.5139 140.812 88.5139Z" fill="#CDD5C4" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M55.0898 104.905C55.0898 104.905 52.4041 102.099 53.6112 96.7573C53.6112 96.7573 51.9213 93.1663 54.4863 90.541C54.4863 90.541 53.7922 86.3465 57.2323 84.4454C57.2323 84.4454 57.5039 81.8502 59.6766 79.6473V104.875H55.0898V104.905Z" fill="#8DF570" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M64.2938 104.905C64.2938 104.905 66.9795 102.099 65.7725 96.7573C65.7725 96.7573 67.4623 93.1663 64.8974 90.541C64.8974 90.541 65.5914 86.3465 62.1513 84.4454C62.1513 84.4454 61.8797 81.8502 59.707 79.6473V104.875H64.2938V104.905Z" fill="#B8F5A8" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M76.1265 0H116.126L146.126 30V73.1546C142.653 69.3714 137.667 67 132.126 67C121.633 67 113.126 75.5066 113.126 86C113.126 91.5404 115.498 96.527 119.281 100H76.1265C70.6265 100 66.1265 95.5 66.1265 90V10C66.1265 4.5 70.6265 0 76.1265 0ZM96.1265 75L121.126 60L96.1265 45V75ZM111.126 7.5V35H138.626L111.126 7.5Z" fill="#CDD4C4" />
                                        </svg>
                                        <p className='text-dark fw-600 fs-4 mt-3 mb-0'>No Video</p>
                                        <p className='text-custom-grey fw-600 fs-4 mb-5'>Looks like you haven't added any video yet.</p>
                                        <Button className='bg-green text-center text-white mx-auto px-4 rounded py-3 custom-shadow border-0 fs-5' onClick={() => setShowVideoModal(true)}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                            <path d="M15 6.14545V9.85455H9.23864V16H5.76136V9.85455H0V6.14545H5.76136V0H9.23864V6.14545H15Z" fill="white" />
                                        </svg>Add video</Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showVideoModal} size="md" onHide={() => { setShowVideoModal(false); setThumbnail('') }}>
                <Modal.Header className='text-center border-0 bg-green custom-modal-header' closeButton>
                    <Modal.Title className='text-white'>Add Video</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-3'>
                    <div>
                        <div className=''>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Video  Title</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" placeholder="Enter your video title" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
                            </Form.Group>
                            <div className='text-center my-3'>
                                <div style={{ height: '300px' }}>
                                    <img className={`w-100 h-100 objectfit-cover ${thumbnail ? '' : 'noDisplay'}`} src={thumbnail} onClick={handleImageClick} />

                                    <div className={`text-center ${thumbnail ? 'noDisplay' : ''}`}>
                                        <div className="wrapper-2 mt-0 bg-light rounded">
                                            <input type="file" id="file" onChange={handleFileChange} ref={fileInputRef} />
                                            <label for="file" className='text-muted mt-0 fw-600 p-5'><svg className='d-block mx-auto mb-2' xmlns="http://www.w3.org/2000/svg" width="63" height="53" viewBox="0 0 63 53" fill="none">
                                                <path d="M57.069 0H6.02244C3.20231 0 0.917969 2.25296 0.917969 5.02845V40.2281C0.917969 43.004 3.20231 45.2566 6.02244 45.2566H35.5934C35.4607 44.4371 35.3739 43.5996 35.3739 42.7422C35.3739 33.7158 42.8013 26.3996 51.9635 26.3996C55.8174 26.3996 59.355 27.7045 62.173 29.8793V5.02845C62.173 2.25286 59.886 0 57.0686 0L57.069 0ZM26.4415 32.686V12.5711L41.7553 22.6286L26.4415 32.686Z" fill="#D3D3D3" />
                                                <path d="M41.7554 45.2571H49.4123V52.8H54.5167V45.2571H62.1736L51.9641 32.686L41.7554 45.2571Z" fill="#D3D3D3" />
                                            </svg>Upload video thumbnail</label>
                                        </div>
                                    </div>
                                </div>
                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                    <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Video  URL</Form.Label>
                                    <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" placeholder="Please enter your video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label className='fs-15 text-custom-grey fw-600'>Short Description</Form.Label>
                                    <Form.Control className='shadow-none fw-600 border-2 border p-3' as="textarea" rows={4} placeholder='Please enter short description' value={description} onChange={(e) => setDescription(e.target.value)} />
                                </Form.Group>
                            </div>
                            <Button className='bg-green text-white w-100 d-block py-3 custom-shadow border-0 mt-3 mb-3' onClick={handleAddVideo}>Add Video</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
