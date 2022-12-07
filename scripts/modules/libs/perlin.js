//from p5.js. You awesome!

const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;
const WORLD_SIZE = 5000;
let perlin_octaves = 4; // default to medium smooth
let perlin_amp_falloff = 0.5; // 50% reduction/octave

const scaled_cosine = i => 0.5 * (1.0 - Math.cos(i * Math.PI));

let perlin;

const water = new Array(PERLIN_SIZE + 1);
const land = new Array(PERLIN_SIZE + 1);
const caveUp = new Array(PERLIN_SIZE + 1);
const caveSide= new Array(PERLIN_SIZE + 1);

const Seed = function(Array,seed) {
  const lcg = (() => {
    const m = 4294967296;
    const a = 1664525;
    const c = 1013904223;
    let seed, z;
    return {
      setSeed(val) {
        z = seed = (val == null ? Math.random() * m : val) >>> 0;
      },
      getSeed() {
        return seed;
      },
      rand() {
        z = (a * z + c) % m;
        return z / m;
      }
    };
  })();

  lcg.setSeed(seed);
  for (let i = 0; i < PERLIN_SIZE + 1; i++) {
    Array[i] = lcg.rand();
  };
};



const Noise = function(array,x, y = 0, z = 0) {
  x = x;
  y = y;
  z = z;

  let size;

  if(array === 'water'){
    size = 25;
    array = water;
  };
  if(array === 'caveUp'){
    size = 20;
    array = caveUp;
  }
  if(array === 'caveSide'){
    size = 7;
    array = caveSide;
  }

  if(array === 'land'){
    size = 16;
    array = land;
  }

  x = x/size;
  y = y/size;
  z = y/size;

  if (x < 0) {
    x = -x;
  }
  if (y < 0) {
    y = -y;
  }
  if (z < 0) {
    z = -z;
  }

  let xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);
  let xf = x - xi;
  let yf = y - yi;
  let zf = z - zi;
  let rxf, ryf;

  let r = 0;
  let ampl = 0.5;

  let n1, n2, n3;

  for (let o = 0; o < perlin_octaves; o++) {
    let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

    rxf = scaled_cosine(xf);
    ryf = scaled_cosine(yf);

    n1 = array[ of & PERLIN_SIZE];
    n1 += rxf * (array[( of +1) & PERLIN_SIZE] - n1);
    n2 = array[( of +PERLIN_YWRAP) & PERLIN_SIZE];
    n2 += rxf * (array[( of +PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    n1 += ryf * (n2 - n1);

    of += PERLIN_ZWRAP;
    n2 = array[ of & PERLIN_SIZE];
    n2 += rxf * (array[( of +1) & PERLIN_SIZE] - n2);
    n3 = array[( of +PERLIN_YWRAP) & PERLIN_SIZE];
    n3 += rxf * (array[( of +PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
    n2 += ryf * (n3 - n2);

    n1 += scaled_cosine(zf) * (n2 - n1);

    r += n1 * ampl;
    ampl *= perlin_amp_falloff;
    xi <<= 1;
    xf *= 2;
    yi <<= 1;
    yf *= 2;
    zi <<= 1;
    zf *= 2;

    if (xf >= 1.0) {
      xi++;
      xf--;
    }
    if (yf >= 1.0) {
      yi++;
      yf--;
    }
    if (zf >= 1.0) {
      zi++;
      zf--;
    }
  }
  return r;
};









function Worm(x,z,y){
  const upValue = Noise('caveUp',x,z);
  const upNormalizeValue = 1-Math.abs(upValue - 0.5)/0.5;
  const upNormalizeValue_2 = (upNormalizeValue-0.9)*10;
  if(upNormalizeValue_2 > 1){
    upNormalizeValue_2 = 1;
  }

  const sideValue = Noise('caveSide',x,y);

  if(upNormalizeValue_2 > 0.6 && sideValue > 0.6){
    return 1;
  }else{
    return 0;
  };
};











function init(seed){
  console.log(seed)
  //

  // const seed = Math.random()*10000;

  // const seed = 8268.8964172898;
  //interesting
  // 3737.7673446488325;
  // 8700.496498345185  ++++
  // 6962.209385488036
  // 8804.477781792417
  // 8980.002119540331

  //c пещерой
  //2291.43157993738





  // Seed(water,Math.random()*10000);
  // Seed(land,Math.random()*10000);


  Seed(water,seed);
  Seed(land,seed/2);
  Seed(caveUp,seed/3);
  Seed(caveSide,seed/3.5);


  //красиво
  //7702.776461305829
  //8704.400393010425
  //8034.4007220886415




  // Seed(water,8480.955521856195);
  // Seed(land,3352.934829580765);


  // Seed(water,7075.8756609770335);
  // Seed(land,744.3126661055932);


  // Seed(water,8675.110169459324);
  //
  // Seed(land,792.8094236559624);

  // Seed(water,9601.303894025552);
  // Seed(land,7712.085510317051);
  // const rand = Math.random()+Math.random();
  // noiseSeed(rand);



  //1536.208112443509
  //3391.075614553909




  //ошибки:
  // 4287.304838265924
  // 1600.8289604964189

  //4283.231871582027
  //1880.5140081516724


  // 1861.1233711493646
  // 3955.421188170922

  //1861.455972750856
  //1741.888634873625
}







const PERLIN_NOISE = {
  init,
  Noise,
  Worm,

};

export {PERLIN_NOISE};
