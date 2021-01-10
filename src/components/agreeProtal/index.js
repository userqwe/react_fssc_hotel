import {useMemo,useState} from 'react'
import {Button} from 'antd-mobile'
import './index.less'

export default function AgreeProtal (props){
    const [visible, setVisible] = useState(false) //弹窗显隐

    useMemo(()=>setVisible(props.model.visible),[props])

    const closeModal = (e,flag)=>{
        props.model.visible =false
        setVisible(false)
        !e&&props.model.callback(flag)
    }

    //同意/不同意
    const agreePro =(flag)=> {
        // if (!flag) this.$nativeApi.exit()
        closeModal('',flag)
    }

    return visible?(
        <div className="dialog">
    <div className="agree-protocol">
        {/* <NavBar icon={<Icon type="left"/>} onLeftClick={closeModal}> 熙攘酒店用户协议 </NavBar> */}
      <div className = "title" > 熙攘酒店用户协议 </div>
      <div className="main-content">
        <div className="contents">
            {/* <p style="background: rgb(248, 248, 248);text-align:center;">
                <span style="font-size:12px;font-family:宋体;color:#333333">协议版本：【</span><span style="font-size:12px;font-family:Roboto;color:#333333">1.0</span><span style="font-size:12px;font-family:宋体;color:#333333">】</span>
            </p>
            <p style="background: rgb(248, 248, 248);text-align:center;">
                <span style="font-size:12px;font-family:宋体;color:#333333">发布</span><span style="font-size:12px;font-family:Roboto;color:#333333">/</span><span style="font-size:12px;font-family:宋体;color:#333333">生效日期：【</span><span style="font-size:12px;font-family:Roboto;color:#333333">2020</span><span style="font-size:12px;font-family:宋体;color:#333333">年</span><span style="font-size:12px;font-family:Roboto;color:#333333">08</span><span style="font-size:12px;font-family:宋体;color:#333333">月</span><span style="font-size:12px;font-family:Roboto;color:#333333">20</span><span style="font-size:12px;font-family:宋体;color:#333333">日】</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">&nbsp;</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">欢迎您使用财务共享熙攘酒店服务平台的服务！</span>
            </p>
            <p style=";background:#F8F8F8">
                <span style="font-size:12px;font-family:宋体;color:#333333">本《<strong>财务共享熙攘酒店用户协议</strong>》（以下简称</span><span style="font-size:12px;font-family:Roboto;color:#333333">“</span><strong><span style="font-size:12px;font-family:宋体;color:#333333">本服务协议</span></strong><span style="font-size:12px;font-family:Roboto;color:#333333">”</span><span style="font-size:12px;font-family:宋体;color:#333333">）是您与财务共享熙攘酒店平台服务</span><span style="font-size:12px;font-family:Roboto;color:#333333">(</span><span style="font-size:12px;font-family:宋体;color:#333333">以下简称</span><span style="font-size:12px;font-family:Roboto;color:#333333">”</span><strong><span style="font-size:12px;font-family:宋体;color:#333333">本平台服务</span></strong><span style="font-size:12px;font-family:Roboto;color:#333333">”)</span><span style="font-size:12px;font-family:宋体;color:#333333">之间就使用酒店预订服务的各项服务等相关事宜所订立的协议。为使用本平台服务，您应当仔细阅读并遵守本服务协议下的全部内容，特别是涉及免除或者责任限制的条款，</span><span style="font-size:12px;font-family:Roboto;color:#333333"> </span>
            </p>
            <p style=";background:#F8F8F8">
                <span style="font-size:12px;font-family:宋体;color:#333333">如您勾选</span><span style="font-size:12px;font-family:Roboto;color:#333333">“</span><span style="font-size:12px;font-family:宋体;color:#333333">我同意本服务协议</span><span style="font-size:12px;font-family:Roboto;color:#333333">”</span><span style="font-size:12px;font-family:宋体;color:#333333">，即视为您已阅读并同意本服务协议，自愿接受本服务协议的所有内容的约束。请您在决定使用服务前再次确认您已知悉并完全理解本服务协议的所有内容。</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">【适用平台】本平台服务协议适用于网页端、移动客户端（包括</span><span style="font-size:12px;font-family:Roboto;color:#333333">IOS</span><span style="font-size:12px;font-family:宋体;color:#333333">、安卓及已有或未来将新增的任何其他移动客户端）等各类平台或媒介中所提供的各项服务。</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">&nbsp;</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <strong><span style="font-size:12px;font-family:宋体;color:#333333">一、账号的使用</span></strong><strong></strong>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">【账号登录】本平台服务仅支持</span><span style="font-size: 15px;font-family:Roboto;color:#333333">TCL</span><span style="font-size:12px;font-family:宋体;color:#333333">体系内员工使用，系统不支持</span><span style="font-size:12px;font-family:Roboto;color:#333333">TCL</span><span style="font-size:12px;font-family:宋体;color:#333333">体系外人员使用。账号无须注册，使用</span><span style="font-size:12px;font-family:Roboto;color:#333333">TCL</span><span style="font-size:12px;font-family:宋体;color:#333333">统一</span><span style="font-size:12px;font-family:Roboto;color:#333333">IDM</span><span style="font-size:12px;font-family:宋体;color:#333333">身份体系</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">【账号借用】本服务允许代订服务、被代订人限定为</span><span style="font-size:12px;font-family:Roboto;color:#333333">TCL</span><span style="font-size:12px;font-family:宋体;color:#333333">体系内员工；</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">【安全义务】如您发现账号存在安全问题，请您立即联系财务共享中心予以调查处理，</span><span style="font-size:12px;font-family:Roboto;color:#333333"> </span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">【限制冻结】您知悉并同意，在符合法律法规的规定，或经国家机关要求的前提下，财务共享中心有权对您的账号进行限制或冻结，在该等情况下，您可能无法继续使用您的注册账号登录本服务。</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">&nbsp;</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <strong><span style="font-size:12px;font-family:宋体;color:#333333">二、下单行为用户规范</span></strong><strong></strong>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">您知悉并承诺，在使用熙攘酒店所提供的服务的过程中，您应遵守相关法律法规，不应从事如下违反法律法规的规定，影响正常服务提供或损害他人合法利益的行为：</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（1）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">预算不足，则不允许提交预订服务，调整预算，请与预算管理员联系；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（2）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">酒店差标由入住人身份而定、若无酒店差标，则不允许提交预订服务；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（3）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">每次只可为一个用户预订酒店；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（4）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">代订服务，代订人需拥有被代订人的代订权限；</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <strong><span style="font-size:12px;font-family:宋体;color:#333333">三、业务中心管理规则规范</span></strong><strong></strong>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">本平台服务只为业务中心提供平台服务而设，服务中限定的管理规则由各业务中心独立设置；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（1）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">各业务中心可设置独立的预算和审批管理规则，规则详情为“是否预算管控”、“是否需审批”；业务中心需联系财务共享运维配置预算和审批管理规则；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（2）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">各业务中心开通本平台服务，即接受本平台服务的“消费即扣减预算”、“业务中心对接人独立对账”、“统一开票”的平台运营管理规则；</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <strong><span style="font-size:12px;font-family:宋体;color:#333333">四、退单用户规范</span></strong><strong></strong>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">您知悉并承诺，在使用熙攘酒店所提供的服务的过程中，您应遵守相关法律法规，详情规范退单过程用户服务规范：</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（1）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">您可拨打客服电话</span><span style="font-size:12px;font-family:Roboto;color:#333333">400-980-6666</span><span style="font-size:12px;font-family:宋体;color:#333333">或直接在历史订单中取消订单；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（2）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">审批中订单可取消审批；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（3）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">已审批订单则视酒店形式，若为“可取消”和“限时取消”酒店预订单，则该酒店可取消，限时取消必须在限定时间内才可取消；</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <strong><span style="font-size:12px;font-family:宋体;color:#333333">四、开票行为用户规范</span></strong><strong></strong>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">您使用本服务在消费过程中，就开票事宜的规范如下：</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（1）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">使用随心订功能，用户支付的款型中个人支付部分，需用户自己手动录入开票抬头、邮箱信息，由携程开具独立的个人支付发票；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（2）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">企业支付部分，您无需申请开票；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <strong><span style="font-size:12px;font-family:Roboto;color:#333333">（3）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-weight: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp; </span></span></strong><span style="font-size:12px;font-family: 宋体;color:#333333">您在酒店入住过程中，出现的除住宿外的其他消费，比如餐饮等；需您独立开票、员工自费；</span><strong></strong>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <strong><span style="font-size:12px;font-family:宋体;color:#333333">五、通知与送达</span></strong><strong></strong>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">您知悉并认可，本平台服务可视情况通过下列任意一种或几种方式向您通知重要信息：</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（1）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">若您为预订人，则会向您的</span><span style="font-size:12px;font-family:Roboto;color:#333333">Tlink/T</span><span style="font-size:12px;font-family:宋体;color:#333333">信</span><span style="font-size:12px;font-family:Roboto;color:#333333"> <span>APP</span></span><span style="font-size:12px;font-family:宋体;color:#333333">发送电子信息；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（2）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">若您为预订人，则会向您的手机号码发送短信信息；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（3）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">若您为被代订人，则会向您的</span><span style="font-size:12px;font-family:Roboto;color:#333333">Tlink/T</span><span style="font-size:12px;font-family:宋体;color:#333333">信</span><span style="font-size:12px;font-family:Roboto;color:#333333"> <span>APP</span></span><span style="font-size:12px;font-family:宋体;color:#333333">发送短信信息；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（4）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">若您为被代订人，则会向您的</span><span style="font-size:12px;font-family:Roboto;color:#333333">Tlink/T</span><span style="font-size:12px;font-family:宋体;color:#333333">信</span><span style="font-size:12px;font-family:Roboto;color:#333333"> <span>APP</span></span><span style="font-size:12px;font-family:宋体;color:#333333">发送短信信息；</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">上述电子信息在发送成功或刊登完成后即视为送达。</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <strong><span style="font-size:12px;font-family:宋体;color:#333333">八、不可抗力或其他免责事由</span></strong><strong></strong>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">您理解并同意，在使用本服务的过程中，可能会遇到不可抗力等风险因素，使本服务协议下的服务发生中断或终止。不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于信息网络设备维护、信息网络连接故障、电脑、通讯或其他系统的故障、电力故障、罢工、劳动争议、暴乱、起义、骚乱、生产力或生产资料不足、火灾、洪水、风暴、爆炸、战争、政府行为、法律法规变动、司法行政机关的命令、其他不可抗力或第三方的不作为而造成的不能服务或延迟服务等行为。出现上述情况时，本平台将努力在第一时间与相关部门配合，及时进行修复，但是由此给您造成的损失，本平台服务在法律允许的范围内免责。</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">【其他免责事由】您理解并同意，在法律允许的范围内，本平台服务对以下事由所导致的服务中断或终止不承担责任：</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（1）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">受到计算机病毒、木马或其他恶意程序、黑客攻击的破坏；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（2）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">用户或本平台服务的电脑软件、系统、硬件和通信线路出现故障；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（3）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">用户操作不当；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（4）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">用户通过非本平台服务授权的方式使用本服务；</span>
            </p>
            <p className="MsoListParagraph" style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:Roboto;color:#333333">（5）<span style="font-variant-numeric: normal;font-variant-east-asian: normal;font-stretch: normal;font-size: 9px;line-height: normal;font-family: &#39;Times New Roman&#39;">&nbsp;&nbsp;&nbsp;&nbsp; </span></span><span style="font-size:12px;font-family:宋体;color:#333333">其他本平台服务无法控制或合理预见的情形。</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <strong><span style="font-size:12px;font-family:宋体;color:#333333">九、管辖、法律适用与争议解决</span></strong>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">本服务协议的成立、生效、履行、解释与纠纷解决，适用中华人民共和国大陆地区法律法规，并且排除一切冲突法规定的适用。</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">如因某项具体服务中的产品或服务问题导致您与本平台服务间出现纠纷，您同意，该等纠纷将由适用于该项具体服务的服务条款或规则中所规定的争议解决地的有管辖权人民法院受理。就本服务协议而言，如您因本服务协议文本与本平台服务产生争议纠纷，您同意交由本服务协议签订地有管辖权人民法院受理。</span>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <strong><span style="font-size:12px;font-family: Roboto;color:#333333">&nbsp;</span></strong>
            </p>
            <p style="background: rgb(248, 248, 248)">
                <span style="font-size:12px;font-family:宋体;color:#333333">再次感谢您的耐心阅读！</span>
            </p>
            <p>
                <br/>
            </p> */}
        </div>
      </div>
      <div className="footer">
        <Button onClick={()=>agreePro(false)}>不同意</Button>
        <Button onClick={()=>agreePro(true)}>同意</Button>
      </div>
    </div>
  </div>
    ):null
    
}