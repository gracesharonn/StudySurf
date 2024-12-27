import {useEffect, useRef, useState} from 'react';
import { SWATCHES } from '@/constants';
import { ColorSwatch, Group } from '@mantine/core';
import {Button} from '@/components/ui/button';
import Draggable from 'react-draggable';
import axios from 'axios';
import { url } from 'inspector';

import { useNavigate } from 'react-router-dom';



interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

interface GeneratedResult {
    expression: string;
    answer: string;
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255, 255, 255');
    const [reset, setReset] = useState(false);
    const [result, setResult] = useState<GeneratedResult>();
    const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
    const [latexPosition, setLatexPosition] = useState({x: 10, y: 200});
    const [dictOfVars, setDictOFVars] = useState({});

    const navigate = useNavigate();

    useEffect (() => {
        if (reset) {
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOFVars({});
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        if (latexExpression.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [latexExpression])

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result])

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round'; /* brush type */
                ctx.lineWidth = 3;
                canvas.style.background = '#100f22'
            }
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/config/TeX-MML-AM_CHTML.js'
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: {inlineMath: [['$', '$'],['\\(','\\)']]}
            })
        };


        return () => {
            document.head.removeChild(script);
        }
    }, []);

    const renderLatexToCanvas = (expression: string, answer: string) => {
        const output = `${expression} = ${answer}`;
        setLatexExpression([...latexExpression, output]);
    
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';  // Set the text color to white
                ctx.font = '36px';
            }
        }
    };
    

    const sendData = async () => {
        const canvas = canvasRef.current;

        if (canvas) {
            console.log('Sending data...', `${import.meta.env.VITE_API_URL}/calculate`);
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_API_URL}/calculate`,
                data: {
                    image: canvas.toDataURL('image/png'),
                    dict_of_vars: dictOfVars,
                }
            });

            const resp = await response.data;
            resp.data.forEach((data: Response) => {
                if (data.assign === true) {
                    setDictOFVars({
                        ...dictOfVars,
                        [data.expr]: data.result
                    })
                }
            })

            const ctx = canvas?.getContext('2d');
            const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

            for (let y = 0; y <canvas?.height; y++) {
                for (let x = 0; x <canvas?.width; x++) {
                    if (imageData.data[(y * canvas.width + x) * 4 + 3] > 0){
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            const centerX = (minX + maxX) /2;
            const centerY = (minY + maxY) /2;

            setLatexPosition({x: centerX, y: centerY});

            resp.data.forEach((data: Response) => {
                setTimeout(() => {
                    setResult({
                        expression: data.expr,
                        answer: data.result
                    });
                });
            }, 200);
        }
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.background = '#100f22';
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setIsDrawing(true);
            }
        }
    }
            
    const stopDrawing = () => {
        setIsDrawing(false);
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) {
            return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };

    return (
        <>
            <div className='grid grid-cols-3 gap-2'>
                <Button
                    onClick={() => setReset(true)}
                    className='relative top-10 z-30 bg-[#F1853E] text-white py-8 px-16 text-xl h-25 rounded-full hover:bg-[#FFE9D3] hover:text-[#040172] transition-all duration-500'
                    variant='default' 
                    color='black'
                    style={{ fontSize: '25px', width: '250px' }}
                >
                    Reset
                </Button>
                <Group className='z-20'>
                    {SWATCHES.map((swatch) => (
                        <ColorSwatch 
                            key={swatch} 
                            color={swatch} 
                            onClick={() => setColor(swatch)} 
                            style={{ width: '35px', height: '35px' }} 
                            className='top-5'
                        />
                    ))}
                </Group>

                <Button
                    onClick={sendData}
                    className='relative top-10 left-5 z-30 bg-[#F1853E] text-white py-8 px-16 text-xl h-25 rounded-full hover:bg-[#FFE9D3] hover:text-[#040172] transition-all duration-500'
                    variant='default'
                    color='white'
                    style={{ fontSize: '25px', width: '250px' }}
                >
                    Run
                </Button>
            </div>
            <canvas
                ref={canvasRef}
                id='canvas'
                className='absolute top-0 left-0 w-full h-full'
                onMouseDown={startDrawing}
                onMouseOut={stopDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
            />

            {/* Back Button */}
            <Button
                onClick={() => navigate('/')} // Navigate back to landing page
                className='absolute top-10 left-5 z-30 bg-[#F1853E] text-white py-8 px-16 text-xl h-25 rounded-full hover:bg-[#FFE9D3] hover:text-[#040172] transition-all duration-500'
                variant='default'
                style={{ fontSize: '25px' }}
            >
                Back
            </Button>

            <canvas
                ref={canvasRef}
                id='canvas'
                className='absolute top-0 left-0 w-full h-full'
                onMouseDown={startDrawing}
                onMouseOut={stopDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
            />

            {latexExpression && latexExpression.map((latex, index) => (
                <Draggable
                    key={index}
                    defaultPosition={latexPosition}
                    onStop={(e, data) => setLatexPosition({x: data.x, y: data.y})}
                >
                    <div
                        className='absolute text-white' style={{fontSize: '36px'}}
                    >
                        <div className='latex-content'>{latex}</div>
                    </div>
                </Draggable>
            ))}
        </>
    );
}
