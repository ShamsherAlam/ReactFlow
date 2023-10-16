import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import credCard from '../../Image/credit.png'; // with import

import './index.css';

const initialNodes = [
    {
        id: '1',
        // name : 'Parent 1',
        name: (<div>
            <p className='title'>Credit card Journey</p>
            <img src={credCard} alt="Credit card" width="100" height="50"></img>
            <p className='descriptipn'>credit card details</p>
            <p><a href="https://home.barclays/" target="_blank">Visit Barclays</a></p>
        </div>),
        style: {
            background: "#D6D5E6",
            color: "#333",
            border: "1px solid #222138",
            width: 250
          },
        children: [
            {
                id: '2',
                name : 'Child 1',
                parent: '1',
                allParent: ['1'],
                children : [
                    {
                        id: '3',
                        name: 'Child 1.1',
                        parent: '2',
                        allParent: ['1', '2'],
                        children: [
                            {
                                id: '4',
                                parent: '3',
                                allParent: ['1', '2', '3'],
                                name: 'Child 1.2',
                            }
                        ]
                    }
                ]
            },
            {
                id: '5',
                name : 'Child 2',
                parent: '1',
                allParent: ['1'],
                children : [
                    {
                        id: '6',
                        name: 'Child 2.1',
                        parent: '5',
                        allParent: ['1', '5'],
                        children: [
                            {
                                id: '7',
                                parent: '6',
                                allParent: ['1', '5', '6'],
                                name: 'Child 2.2',
                            }
                        ]
                    }
                ]
            },
            {
                id: '8',
                name : 'Child 3',
                parent: '1',
                allParent: ['1'],
                children : [
                    {
                        id: '9',
                        name: 'Child 3.1',
                        parent: '8',
                        allParent: ['1', '8'],
                        children: [
                            {
                                id: '10',
                                parent: '9',
                                allParent: ['1', '8', '9'],
                                name: 'Child 3.2',
                            }
                        ]
                    }
                ]
            },
            {
                id: '11',
                name : 'Child 4',
                parent: '1',
                allParent: ['1'],
            }
        ]
    }
]

const initialEdges = [
  {
    id: 'edges-e5-7',
    source: '0',
    target: '1',
    label: '+',
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 0.7 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  }
]

let id = 1;
const getId = () => `${id++}`;

const fitViewOptions = {
  padding: 1,
};

const ExpandAndCollapse = (props) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  useEffect(()=>{
    setNodes([...initialNodes.map((item)=>{
        return {
            id: item.id,
            type: item?.children?.length ? 'default': 'output',
            data: { label: item.name, children: item.children },
            position: { x: 0, y: 0 },
            sourcePosition: 'right',
            targetPosition: 'left'
        }
    })])
  },[])

  const handleNodeClick = (e, data) => {
    const findChildren = nodes.filter((item)=>item?.data?.parent===data.id)
    if(!findChildren.length){
        const itemChildren = [...data.data.children.map((item, i)=>{
            return {
                id: item.id,
                type: item?.children?.length ? 'default': 'output',
                data: { label: item.name, children: item.children, parent: item.parent, allParent: item.allParent },
                position: { x: data.position.x+300, y:  i===0? data.position.y : data.position.y+i*100 },
                sourcePosition: 'right',
                targetPosition: 'left'
            }
        })]
        setEdges([
            ...edges,
            ...itemChildren.map((item)=>{
                return {
                    id: String(parseInt(Math.random(100000000)*1000000)),
                    source: item?.data?.parent,
                    target: item?.id,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                    },
                }
            })
        ])
        setNodes(nodes.concat(itemChildren))
    }else{
        setNodes([
            ...nodes.filter((item)=>item?.data?.children || item?.data).filter((x) => !x?.data?.allParent?.includes(data.id))
            // ...nodes.filter((item)=>!item?.data?.allParent?.includes(data.id))
        ])
        setEdges([
            ...edges.filter((item)=>data.id!==item.source)
        ])
    }
  }


  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        maxZoom={0.9}
        defaultViewport={{x:1, y:1, zoom:0.5}}
        fitViewOptions={fitViewOptions}
      />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <ExpandAndCollapse />
  </ReactFlowProvider>
);