import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import ReactHlsPlayer from 'react-hls-player';
import 'element-theme-default';
import {Button, List, Table} from 'antd';
import {allLinks, linkDetail} from "./service/links.service";
import {HeaderView} from "./view/monitor/header";
import {Request_tree, RequestTree} from "./view/monitor/request_tree";
// import './index.css';

const App = () => {

    const [data, setData] = useState([])

    const [requestHeader, setRequestHeader] = useState([])
    const [responseHeader, setResponseHeader] = useState([])

    const [requestBody, setRequestBody] = useState("")
    const [responseBody, setResponseBody] = useState("")

    useEffect(() => {
        html_Methods()
        const i = setInterval(function (){
            html_Methods()
        },1000)
        return () => {
            clearInterval(i)
        }
    },[])

    function html_Methods() {
        allLinks({start: 100}).then((res) => {
            console.log(res)

            setData(res)

        })
    }

    const onClick = (e) => {
        linkDetail({id: e}).then((res) => {
            console.log(res)

            let list11 = Object.keys(res.request_header).map(item => {

                return {
                    name: item,
                    value: res.request_header[item]
                }
            })
            let list1 = [{
                name: "host",
                value: res.host
            },{
                name: "path",
                value: res.path
            },{
                name: "method",
                value: res.method
            }]
            list1.push(...list11)


            let list22 = Object.keys(res.response_header).map(item => {

                return {
                    name: item,
                    value: res.response_header[item]
                }
            })

            let list2 = [{
                name: "status",
                value: res.status_code
            }]
            list2.push(...list22)

            setRequestHeader(list1)
            setResponseHeader(list2)

            setRequestBody(res.request_body)

            var decodedString = atob(res.response_body);
            setResponseBody(decodedString)
        })
    }

    return (
        <div style={{display: "flex", flexDirection: "row", position: "fixed", left: 0, right: 0, top: 0, bottom: 0}}>
            <div style={{width: "250px", flexShrink: 0, overflowY: "auto"}}>
                {/*<Button type="primary" onClick={html_Methods}>hahahah</Button>*/}
                <RequestTree onClick={onClick}
                    style={{height: "100%"}}
                    dataSource={data}
                />
            </div>

            <div style={{display: "flex", flexDirection: "column"}}>


                <div style={{flex: 1, flexShrink: 0, overflow: "auto"}}>
                    <HeaderView headers={requestHeader}/>
                    {requestBody}
                </div>
                <div style={{backgroundColor: "black", height: "2px"}}></div>
                <div style={{flex: 1, flexShrink: 0, overflow: "auto"}}>
                    <HeaderView headers={responseHeader}/>
                    {responseBody}
                </div>
            </div>
        </div>
    )

};

export default App;