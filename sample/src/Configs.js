
class ApiEnv {
  constructor(url) {
    this.url = url
  }
}

class Env {
  constructor(api, media, gossip) {
    this.api = api
    this.media = media
    this.gossip = gossip
  }
}

class GossipEnv {
  constructor(url, channelKey) {
    this.url = url
    this.channelKey = channelKey
  }
}

class MediaEnv {
  constructor(url) {
    this.url = url
  }
}

const locals = new Env(
  new ApiEnv('http://localhost:28080'),
  new MediaEnv('http://localhost:28080'),
  new GossipEnv('ws://192.168.0.79:8080/gossip', '0V2c0FGcwFjOhJDM1EjM'),
)

const devTests = new Env(
  new ApiEnv('https://flipflop-dev.jocoos.com'),
  new MediaEnv('wss://media-dev.jocoos.com:7188/janus'),
  new GossipEnv('wss://media-dev.jocoos.com:8100/gossip', '0V2c0FGcwFjOhJDM1EjM')
)

const devs = new Env(
  new ApiEnv(window.location.origin),
  new MediaEnv('wss://media-dev.jocoos.com:7188/janus'),
  new GossipEnv('wss://media-dev.jocoos.com:8100/gossip', '0V2c0FGcwFjOhJDM1EjM')
)

const prods = new Env(
  new ApiEnv(window.location.origin),
  new MediaEnv('wss://media.flipflop.tv:7188/janus'),
  new GossipEnv('wss://media.flipflop.tv:8100/gossip', '0V2c0FGcwFjOhJDM1EjM')
)

export const envs = process.env.REACT_APP_STAGE === 'prod'?  prods: 
    process.env.REACT_APP_STAGE === 'dev' ? devs : 
    process.env.REACT_APP_STAGE === 'dev-test' ? devTests : locals;

export default {
  DEFAULT_AVATAR: 'https://s3.ap-northeast-2.amazonaws.com/mybeautip/avatar/img_profile_default.png',
  PAGE_COUNT: 21,
  DEFAULT_THUMBNAIL: 'https://flipflop-prod.s3.ap-northeast-2.amazonaws.com/public/thumbnail.png',
  SAMPLE_GOODS: [
    {id: 1, title: '무드 레시피 페이스 블러쉬', price: 11150, thumbnail_url: 'https://shop-phinf.pstatic.net/20190115_111/skintoktalk_1547534269607gspMb_JPEG/70841429225391267_1684561795.jpg?type=m510'},
    {id: 2, title: '해피바스 한장 샤워티슈', price: 4900, thumbnail_url: 'https://shop-phinf.pstatic.net/20190528_286/outrun_1559002838548CKVPz_JPEG/41721697397965005_925796858.jpg?type=m510'},
    {id: 3, title: '[밀리마쥬] 무료배송 베스풀 블러셔', price: 12000, thumbnail_url: 'https://shop-phinf.pstatic.net/20180319_79/hcmnt01_1521432991594x1Rtm_JPEG/44740151216675877_466425841.jpg?type=m450'},
    {id: 4, title: '려 자양윤모 트리트먼트 200ml', price: 5000, thumbnail_url: 'https://shop-phinf.pstatic.net/20190510_295/outrun_1557451917414UQYjN_JPEG/80758218041478328_924887128.jpg?type=m510'},
    {id: 5, title: '[3CE] 벨벳 립 틴트 4g', price: 9170, thumbnail_url: 'https://shop-phinf.pstatic.net/20181228_46/skintoktalk_1545962390562vaoSw_JPEG/28593570204060548_313533979.jpg?type=m510'},
  ]
}