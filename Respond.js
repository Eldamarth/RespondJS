const Respond = {
    createElement: (type, attributes = {}, children = []) => {
        const childElements = children.map(child => (
            typeof child === 'string' ? 
                Respond.createElement('text', {textContent: child}) :
                child
        ));

        return {
            type,
            children: childElements,
            props: Object.assign (
                { children: childElements },
                attributes
            )
        };

    }
};

export default Respond;