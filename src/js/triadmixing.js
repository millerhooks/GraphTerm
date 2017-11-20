//http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms/

function nextFloat(){
    return chance.floating({min: 0.0001, max: 1.0000})
}

function toFloat32(value) {
    var bytes = 0;
    switch (value) {
        case Number.POSITIVE_INFINITY: bytes = 0x7F800000; break;
        case Number.NEGATIVE_INFINITY: bytes = 0xFF800000; break;
        case +0.0: bytes = 0x40000000; break;
        case -0.0: bytes = 0xC0000000; break;
        default:
            if (Number.isNaN(value)) { bytes = 0x7FC00000; break; }

            if (value <= -0.0) {
                bytes = 0x80000000;
                value = -value;
            }

            var exponent = Math.floor(Math.log(value) / Math.log(2));
            var significand = ((value / Math.pow(2, exponent)) * 0x00800000) | 0;

            exponent += 127;
            if (exponent >= 0xFF) {
                exponent = 0xFF;
                significand = 0;
            } else if (exponent < 0) exponent = 0;

            bytes = bytes | (exponent << 23);
            bytes = bytes | (significand & ~(-1 << 23));
        break;
    }
    return bytes;
}

function RandomMix(color1, color2, color3, greyControl)
{
    color1 = tinycolor(color1).toRgb();
    color2 = tinycolor(color2).toRgb();
    color3 = tinycolor(color3).toRgb();
    var randomIndex = toFloat32(nextFloat())% 3;

    var mixRatio1 =
      (randomIndex == 0) ? nextFloat() * greyControl : nextFloat();

    var mixRatio2 =
      (randomIndex == 1) ? nextFloat() * greyControl : nextFloat();

    var mixRatio3 =
      (randomIndex == 2) ? nextFloat() * greyControl : nextFloat();

    var sum = mixRatio1 + mixRatio2 + mixRatio3;

    mixRatio1 /= sum;
    mixRatio2 /= sum;
    mixRatio3 /= sum;

    return tinycolor(
        toFloat32((mixRatio1 * color1.r + mixRatio2 * color2.r + mixRatio3 * color3.r)),
        toFloat32((mixRatio1 * color1.g + mixRatio2 * color2.g + mixRatio3 * color3.g)),
        toFloat32((mixRatio1 * color1.b + mixRatio2 * color2.b + mixRatio3 * color3.b))
    );
}