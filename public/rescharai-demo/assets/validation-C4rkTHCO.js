const t=["6_Propagation","8_NetPay"],a=i=>{const l=i?.pipeline_status||{};return t.some(e=>l[e]==="valid")},s=i=>(Array.isArray(i)?i:[]).filter(a),n=i=>s(i)[0]||null;export{s as a,n as g,a as i};
