FROM nginx:latest

# RUN apt-get update
# RUN apt-get install iptables
# RUN iptables -F 
# RUN iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT 
# RUN iptables -A INPUT -i lo -j ACCEPT 
# RUN iptables -A INPUT -p tcp --dport 22 -j ACCEPT 
# RUN iptables -A INPUT -p tcp --dport 443 -j ACCEPT 
# RUN iptables -A INPUT -p tcp -j DROP
