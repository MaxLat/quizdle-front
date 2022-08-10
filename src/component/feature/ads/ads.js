import React, { useEffect } from "react";

export default function Ads(props) {

    const {currentPath} = props
    console.log(currentPath)
    useEffect(() => {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
        }, [currentPath])

    return (
        <div key={currentPath}>
            <ins
                className="adsbygoogle"
                style={{display :'block'}}
                data-ad-client="ca-pub-5717123151475914"
                data-ad-slot="1616236672"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
}
