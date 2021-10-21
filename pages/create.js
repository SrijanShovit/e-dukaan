import React from 'react'
import baseUrl from '../helpers/baseUrl'
import {parseCookies} from 'nookies'
import { useState } from 'react'

const Create = () => {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [media, setMedia] = useState('')
    const [description, setDescription] = useState('')
    const handleSubmit = async (e) => { 
        e.preventDefault()
        const mediaUrl = await imageUpload()
        const res = await fetch(`${baseUrl}/api/products/`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                 name,price,description,mediaUrl
            })
        })
        const res2 = await res.json()
        if (res2.error){
            M.toast({html: res2.error,classes:'red'})
        }else{
            M.toast({html: 'Product saved',classes:'green'})
            router.push('/')
        }
    }

    const imageUpload = async() => {
        const data = new FormData()
        data.append('file',media)
        data.append('upload_preset','edukaan')
        data.append('cloud_name','myinstamern')
        const res = await fetch('	https://api.cloudinary.com/v1_1/myinstamern/image/upload',{
            method:'POST',
            body:data
        })
        const res2 = await res.json()
        return res2.url
    }
    return (
        <form className="container" onSubmit={(e)=>handleSubmit(e)}>
            <input type="text" name="name" placeholder="Name"
                value={name} onChange={(e) => { setName(e.target.value) }} />
            <input type="text" name="price" placeholder="Price"
                value={price} onChange={(e) => { setPrice(e.target.value) }} />
            <div className="file-field input-field">
                <div className="btn">
                    <span>File</span>
                    <input type="file"
                    accept="image/*" 
                    onChange={(e)=> {setMedia(e.target.files[0])}}
                    // getting file object
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <img className="responsive-img" src={media ? URL.createObjectURL(media) : ''}/>
            <textarea className='materailize-textarea' name="description" placeholder="Description"
                value={description} onChange={(e) => { setDescription(e.target.value) }} />
                 <button data-target="modal1" className="btn modal-trigger waves-effect waves-light #00b0ff light-blue accent-3" type="submit">Add Item
                <i className="material-icons right">send</i>
            </button>
        </form>

    )
}

export async function getServerSideProps(context){
    const cookie = parseCookies(context)
    const user = cookie.user ? JSON.parse(JSON.stringify(cookie.user)) :""
    if (user.role != "admin" || user.role != "root"){
        const {res} = context
        res.writeHead(302,{Location: '/'})
        res.end()
    }
    return {
        props: {}
    }
}

export default Create
