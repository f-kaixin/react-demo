import React, { Component } from 'react';
import { authSession } from 'src/api/index.js'
import './index.scss';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false
        }
    }

    // 登陆
    Login = e => {
        e.preventDefault();
        this.setState({
            submitLoading: true
        })
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {username, password} = values;
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                authSession({username, password}).then(res => {
                    if (res.retcode === 0 && res.result) {
                        res.result.ifOk ?
                            this.props.history.push({ pathname: '/' }) :
                            message.warning('登陆失败，请重新尝试', 3000);
                    }
                })
            }
        });
        this.setState({
            submitLoading: false
        })
    };

    // 校验密码输入
    validatePassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value) {
            /[0-9]/.test(value) && /[a-zA-Z]/.test(value) ?
                callback() :
                callback('密码必须由字母和数字组成');
        } else {
            callback('请输入密码');
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <section id="login_form_section">
                <Form onSubmit={this.Login} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            initialValue: 'admin',
                            rules: [{ required: true, message: '请输入用户名' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入用户名"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    validator: this.validatePassword
                                }
                            ],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请输入密码"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>记住密码</Checkbox>)}
                        <a className="login-form-forgot" href="">
                            忘记密码
                        </a>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.submitLoading}>
                            登 陆
                        </Button>
                        <a href="">注册用户</a>
                    </Form.Item>
                </Form>
            </section>
        )
    }
}

const WrappedLoginForm = Form.create()(LoginForm);
export default WrappedLoginForm;
