const Reconciler = {
    
    //  Takes a virtual element created by Respond.createElement(), a container node, and the old DOM element to replace or update.
    //  The old DOM element doesn't necessarily exist, i.e. at first call of render method.
    diff: ()=>{},
         

    updateTextNode: ()=>{},


    updateDomElement:()=>{},


    mountElement: ()=>{},

}


export default {
    render: (element, container) => {
        Reconciler.diff(element,container,container.firstChild);
    }
};