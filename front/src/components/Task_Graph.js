import { Container } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    updateEdge,
    Edge,
    Node,
} from 'react-flow-renderer';

import { useLocation } from 'react-router-dom';


import { useCallback, useState, onMouseEnter } from 'react';
import { useParams } from 'react-router';

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Node 0' },
        position: { x: 250, y: 5 },
        className: 'light',
    },
    {
        id: '2',
        data: { label: 'Group A' },
        position: { x: 250, y: 5 },
        className: 'light',
        style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 200, height: 200 },
    },
    {
        id: '2a',
        data: { label: 'Node A.1' },
        position: { x: 250, y: 5 },
        parentNode: '2',
    },
    { id: '3', data: { label: 'Node 1' }, position: { x: 320, y: 100 }, className: 'light' },
    {
        id: '4',
        data: { label: 'Group B' },
        position: { x: 250, y: 5 },
        className: 'light',
        style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 300, height: 300 },
    },
    {
        id: '4a',
        data: { label: 'Node B.1' },
        position: { x: 250, y: 5 },
        className: 'light',
        parentNode: '4',
        extent: 'parent',
    },
    {
        id: '4b',
        data: { label: 'Group B.A' },
        position: { x: 250, y: 5 },
        className: 'light',
        style: { backgroundColor: 'rgba(255, 0, 255, 0.2)', height: 150, width: 270 },
        parentNode: '4',
    },
    {
        id: '4b1',
        data: { label: 'Node B.A.1' },
        position: { x: 250, y: 5 },
        className: 'light',
        parentNode: '4b',
    },
    {
        id: '4b2',
        data: { label: 'Node B.A.2' },
        position: { x: 250, y: 5 },
        className: 'light',
        parentNode: '4b',
    },
];

const initialEdges = [
];

const Task_Graph = () => {
    const location = useLocation();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = (params) => setEdges((eds) => addEdge(params, eds));
    const onEdgeUpdate = (oldEdge, newConnection) => setEdges((els) => updateEdge(oldEdge, newConnection, els));

    return (
        <Container h="1000px">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onEdgeUpdate={onEdgeUpdate}
                onConnect={onConnect}
                onInit={onInit}
                fitView
                attributionPosition="top-right"
                height="100px"
                position="absolute"
            >
                <MiniMap
                    nodeStrokeColor={(n) => {
                        if (n.style?.background) return n.style.background;
                        if (n.type === 'input') return '#0041d0';
                        if (n.type === 'output') return '#ff0072';
                        if (n.type === 'default') return '#1a192b';

                        return '#eee';
                    }}
                    nodeColor={(n) => {
                        if (n.style?.background) return n.style.background;

                        return '#fff';
                    }}
                    nodeBorderRadius={2}
                />
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </Container>

    )
}

export default Task_Graph;