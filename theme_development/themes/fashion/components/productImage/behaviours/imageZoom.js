/**
 * ------------------------------------------------------------
 * Cartique Theme Benchmark Behaviour
 * imageZoom
 * ------------------------------------------------------------
 */

export default {

    name: "imageZoom",

    mount(ctx){

        const image =
            ctx.elements.image;

        if(!image){
            return;
        }

        image.addEventListener(
            "mouseenter",
            ()=>{

                image.style.transform =
                    "scale(1.08)";

            }
        );

        image.addEventListener(
            "mouseleave",
            ()=>{

                image.style.transform =
                    "scale(1)";

            }
        );

    },

    unmount(ctx){

        // Reserved for future cleanup

    }

};
