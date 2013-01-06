index-generator
===============

Generate indices from spreadsheets.
Take input like:
    
    Part No,No,des1,des2,des3,des4,des5,des6,des7,des8,des9,des10,des11,des12
    3M1100,548,"Protector, Hearing",Hearing Protector,"Plug, Ear",Ear Plug,,,,,,,,
    3M1425,547,"Protector, Hearing",Hearing Protector,,,,,,,,,,
    3M1427,547,"Protector, Hearing",Hearing Protector,,,,,,,,,,
    3M1721,550,"Glasses, Safety",,,,,,,,,,,
    3M1722,550,"Glasses, Safety",Safety Glasses,,,,,,,,,,
    3M1723,550,"Glasses, Safety",Safety Glasses,,,,,,,,,,
    3M2071,545,"Filter, Sanding/Grinding",,,,,,,,,,,
    3M20901,623,"Tape, Masking, Safe Release",Masking Tape,,,,,,,,,,
    3M20901-1/2,623,"Tape, Masking, Safe Release",Masking Tape,,,,,,,,,,
    3M20902,623,"Tape, Masking, Safe Release",Masking Tape,,,,,,,,,,
    3M20907-180,106,"Sponge, Sanding",Sanding Sponge,,,,,,,,,,
    3M20908-150,106,"Sponge, Sanding",Sanding Sponge,,,,,,,,,,
    3M20908-80,106,"Sponge, Sanding",Sanding Sponge,,,,,,,,,,
    3M20909-60,106,"Sponge, Sanding",Sanding Sponge,,,,,,,,,,
    3M2091,545,"Filter, Asbestos Abatement",,,,,,,,,,,

Produces output like:

    description,pages
    Protector, Hearing,547,548
    Hearing Protector,547,548

The output is sorted alphabetically and the page numbers are sorted numerically.

Do it in the browser to ease deployment.


