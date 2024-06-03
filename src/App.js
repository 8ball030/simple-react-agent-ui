import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AGENT_API = 'http://localhost:5555';
const AGENT_WS  = 'http://localhost:5556';

const AgentInfo = () => {
    const [agentInfo, setAgentInfo] = useState({});
    
    useEffect(() => {
        // handle the api call and error handling
        axios.get(`${AGENT_API}/api/agent-info`)
        .then(response => {
            console.log(response.data);
            setAgentInfo(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }, []);
    
    return (
        <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        {/* We check if there is any data from the api call, if so we update the tabel.else display no data. */}
        {(agentInfo && Object.keys(agentInfo).map(key => (
            <tr key={key}>
                <td>{key}</td>
                <td>{agentInfo[key]}</td>
            </tr>
        ))) || <tr><td colSpan="2">No data</td></tr>}
        </table>
    );

}

const WebsocketData = () => {
    // the ws data is just raw text lines.
    const [data, setData] = useState([]);
    const [userMessage, setUserMessage] = useState('');

    useEffect(() => {
        const ws = new WebSocket(AGENT_WS);

        ws.onopen = () => {
            console.log('Websocket connected');
        };

        ws.onmessage = (message) => {
            console.log(message.data);
            data.push(message.data);
            setData([...data].reverse());
        };
        ws.onclose = () => {
            console.log('Websocket disconnected');
        };
        return () => {
            ws.close();
        };
    }
    , []);


    return (
        <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        {(data && data.map((line, index) => (
            <tr key={index}>
                <td>{line}</td>
            </tr>
        ))) || <tr><td>No data</td></tr>}
        </table>
    );
}


const PingAgent = () => {
    const [userMsg, setUserMsg] = useState('');

    const handlePing = () => {
        const ws = new WebSocket(AGENT_WS);
        ws.onopen = () => {
            ws.send(userMsg);
        };
        ws.onclose = () => {
            console.log('Websocket disconnected');
        };
    }

    return (
        <div>
            <input type="text" value={userMsg} onChange={e => setUserMsg(e.target.value)} style={{ width: '100%' }} />
            <button onClick={handlePing}>Ping</button>
        </div>
    );
}

    const App = () => {
        return (
            <div>
                <AgentInfo />
                <PingAgent />
                <WebsocketData />

            </div>
        );
    }
    export default App;
